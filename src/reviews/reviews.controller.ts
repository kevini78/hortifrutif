import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus, UsePipes, ValidationPipe, NotFoundException } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from "@nestjs/swagger";
import { Review } from "./entities/review.entity";

@ApiTags("reviews")
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: "Criar uma nova avaliação para um pedido entregue" })
  @ApiResponse({ status: 201, description: "Avaliação criada com sucesso.", type: Review })
  @ApiResponse({ status: 400, description: "Dados inválidos ou pedido não está no status correto." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  @ApiResponse({ status: 404, description: "Pedido não encontrado." })
  @ApiResponse({ status: 409, description: "Pedido já avaliado." })
  create(@Request() req, @Body() createReviewDto: CreateReviewDto): Promise<Review> {
    const userId = req.user.userId;
    return this.reviewsService.create(createReviewDto, userId);
  }

  @Get("order/:orderId")
  @ApiOperation({ summary: "Listar todas as avaliações de um pedido específico" })
  @ApiParam({ name: "orderId", description: "ID do pedido", type: Number })
  @ApiResponse({ status: 200, description: "Lista de avaliações retornada com sucesso.", type: [Review] })
  findAllByOrder(@Param("orderId", ParseIntPipe) orderId: number): Promise<Review[]> {
    // Anyone can see reviews for an order (adjust if needed)
    return this.reviewsService.findAllByOrder(orderId);
  }

  @Get("user")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Listar todas as avaliações feitas pelo usuário autenticado" })
  @ApiResponse({ status: 200, description: "Lista de avaliações retornada com sucesso.", type: [Review] })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  findAllByUser(@Request() req): Promise<Review[]> {
    const userId = req.user.userId;
    return this.reviewsService.findAllByUser(userId);
  }

  // Optional: Get a specific review by ID
  @Get(":id")
  @ApiOperation({ summary: "Obter detalhes de uma avaliação específica" })
  @ApiParam({ name: "id", description: "ID da avaliação", type: Number })
  @ApiResponse({ status: 200, description: "Detalhes da avaliação retornados com sucesso.", type: Review })
  @ApiResponse({ status: 404, description: "Avaliação não encontrada." })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Review> {
    // Anyone can see a specific review (adjust if needed)
    const review = await this.reviewsService.findOne(id);
    if (!review) {
        throw new NotFoundException(`Avaliação com ID ${id} não encontrada.`);
    }
    return review;
  }

  // Optional: Delete a review (only by the user who wrote it)
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover uma avaliação feita pelo usuário" })
  @ApiParam({ name: "id", description: "ID da avaliação a ser removida", type: Number })
  @ApiResponse({ status: 204, description: "Avaliação removida com sucesso." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  @ApiResponse({ status: 403, description: "Acesso proibido (não é o autor da avaliação)." })
  @ApiResponse({ status: 404, description: "Avaliação não encontrada." })
  async remove(@Request() req, @Param("id", ParseIntPipe) id: number): Promise<void> {
    const userId = req.user.userId;
    await this.reviewsService.remove(id, userId);
  }
}
