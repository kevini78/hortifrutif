import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus, UsePipes, ValidationPipe, NotFoundException } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
// import { UpdateOrderDto } from "./dto/update-order.dto"; // Not used yet
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from "@nestjs/swagger";
import { Order, OrderStatus } from "./entities/order.entity"; // Import OrderStatus from entity file

@ApiTags("orders")
@Controller("orders")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: "Criar um novo pedido a partir do carrinho atual" })
  @ApiResponse({ status: 201, description: "Pedido criado com sucesso.", type: Order })
  @ApiResponse({ status: 400, description: "Carrinho vazio ou estoque insuficiente." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  create(@Request() req, @Body() createOrderDto: CreateOrderDto): Promise<Order> {
    const userId = req.user.userId;
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os pedidos do usuário autenticado" })
  @ApiResponse({ status: 200, description: "Lista de pedidos retornada com sucesso.", type: [Order] })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  findAll(@Request() req): Promise<Order[]> {
    const userId = req.user.userId;
    return this.ordersService.findAllByUser(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obter detalhes de um pedido específico do usuário" })
  @ApiParam({ name: "id", description: "ID do pedido", type: Number })
  @ApiResponse({ status: 200, description: "Detalhes do pedido retornados com sucesso.", type: Order })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  @ApiResponse({ status: 404, description: "Pedido não encontrado ou não pertence ao usuário." })
  async findOne(@Request() req, @Param("id", ParseIntPipe) id: number): Promise<Order> {
    const userId = req.user.userId;
    // OrdersService.findOne now throws NotFoundException if not found/allowed
    const order = await this.ordersService.findOne(id, userId);
    // Explicit check although service should throw
    if (!order) {
        throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
    }
    return order;
  }

  // Example: Endpoint to simulate payment confirmation (could be internal/admin)
  @Patch(":id/confirm-payment")
  @ApiOperation({ summary: "Confirmar pagamento de um pedido (simulação)" })
  @ApiParam({ name: "id", description: "ID do pedido", type: Number })
  @ApiResponse({ status: 200, description: "Pagamento confirmado com sucesso.", type: Order })
  @ApiResponse({ status: 400, description: "Pedido não está pendente de pagamento." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  @ApiResponse({ status: 404, description: "Pedido não encontrado." })
  confirmPayment(@Param("id", ParseIntPipe) id: number): Promise<Order> {
      // In a real scenario, this might require admin privileges or be triggered by a payment gateway webhook
      // For now, it's accessible to authenticated users for testing
      return this.ordersService.confirmPayment(id);
  }

  // Example: Endpoint to cancel an order
  @Post(":id/cancel")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Cancelar um pedido" })
  @ApiParam({ name: "id", description: "ID do pedido a ser cancelado", type: Number })
  @ApiResponse({ status: 200, description: "Pedido cancelado com sucesso.", type: Order })
  @ApiResponse({ status: 400, description: "Não é possível cancelar o pedido neste status." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  @ApiResponse({ status: 404, description: "Pedido não encontrado ou não pertence ao usuário." })
  cancelOrder(@Request() req, @Param("id", ParseIntPipe) id: number): Promise<Order> {
      const userId = req.user.userId;
      return this.ordersService.cancelOrder(id, userId);
  }

  // Placeholder for updating status (e.g., admin sets to SHIPPED)
  // @Patch(":id/status")
  // @UseGuards(JwtAuthGuard, AdminGuard) // Example: Requires Admin role
  // @ApiOperation({ summary: "Atualizar status de um pedido (Admin)" })
  // updateStatus(...) { ... }

}
