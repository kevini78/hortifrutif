import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UsePipes, ValidationPipe, ParseIntPipe, HttpCode, HttpStatus, Query, BadRequestException, NotFoundException } from '@nestjs/common'; // Added NotFoundException
import { CartService } from './cart.service';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Cart } from './entities/cart.entity';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard) // Apply guard to the whole controller
@ApiBearerAuth() // Indicate all endpoints require Bearer token
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Obter o carrinho do usuário atual' })
  @ApiResponse({ status: 200, description: 'Carrinho retornado com sucesso.', type: Cart })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Carrinho não encontrado (se não for criado automaticamente).' })
  async getCart(@Request() req): Promise<Cart> { // Changed return type back to Promise<Cart>
    const userId = req.user.userId;
    const cart = await this.cartService.getCartByUserId(userId);
    if (!cart) {
        // This case should ideally not be reached if createIfNotExist=true is the default
        throw new NotFoundException('Carrinho não encontrado para o usuário.');
    }
    return cart;
  }

  @Post('items')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Adicionar um item ao carrinho' })
  @ApiBody({ type: AddItemToCartDto })
  @ApiResponse({ status: 201, description: 'Item adicionado com sucesso.', type: Cart })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou estoque insuficiente.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  addItem(@Request() req, @Body() addItemToCartDto: AddItemToCartDto): Promise<Cart> {
    const userId = req.user.userId;
    return this.cartService.addItemToCart(userId, addItemToCartDto);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Atualizar a quantidade de um item no carrinho' })
  @ApiParam({ name: 'itemId', description: 'ID do item do carrinho a ser atualizado', type: Number })
  @ApiQuery({ name: 'quantity', description: 'Nova quantidade do item', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Quantidade atualizada com sucesso.', type: Cart })
  @ApiResponse({ status: 400, description: 'Quantidade inválida ou estoque insuficiente.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Item do carrinho não encontrado.' })
  updateItemQuantity(
    @Request() req,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Query('quantity', ParseIntPipe) quantity: number // Get quantity from query param
  ): Promise<Cart> {
    const userId = req.user.userId;
    if (quantity === undefined || quantity === null) { // Check for null as well
        throw new BadRequestException('Query parameter \'quantity\' é obrigatório.');
    }
    return this.cartService.updateItemQuantity(userId, itemId, quantity);
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.OK) // Return 200 OK on successful deletion of item
  @ApiOperation({ summary: 'Remover um item do carrinho' })
  @ApiParam({ name: 'itemId', description: 'ID do item do carrinho a ser removido', type: Number })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso.', type: Cart }) // Return updated cart
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Item do carrinho não encontrado.' })
  removeItem(@Request() req, @Param('itemId', ParseIntPipe) itemId: number): Promise<Cart> {
    const userId = req.user.userId;
    return this.cartService.removeItemFromCart(userId, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT) // Return 204 No Content on successful clear
  @ApiOperation({ summary: 'Limpar todos os itens do carrinho' })
  @ApiResponse({ status: 204, description: 'Carrinho limpo com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async clearCart(@Request() req): Promise<void> {
    const userId = req.user.userId;
    await this.cartService.clearCart(userId);
  }
}

