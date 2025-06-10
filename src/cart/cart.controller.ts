import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './entities/cart.entity';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Adicionar produto ao carrinho' })
  @ApiResponse({ status: 201, description: 'Produto adicionado ao carrinho', type: CartItem })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  addToCart(@Body() addToCartDto: AddToCartDto): Promise<CartItem> {
    return this.cartService.addToCart(addToCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar itens do carrinho' })
  @ApiQuery({ name: 'sessionId', description: 'ID da sessão do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de itens do carrinho', type: [CartItem] })
  getCart(@Query('sessionId') sessionId: string): Promise<CartItem[]> {
    return this.cartService.getCart(sessionId);
  }

  @Get('total')
  @ApiOperation({ summary: 'Obter total do carrinho' })
  @ApiQuery({ name: 'sessionId', description: 'ID da sessão do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Total do carrinho',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 25.99 },
        itemCount: { type: 'number', example: 3 }
      }
    }
  })
  async getCartTotal(@Query('sessionId') sessionId: string) {
    return this.cartService.getCartTotal(sessionId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar quantidade do item no carrinho' })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso', type: CartItem })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  updateCartItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    return this.cartService.updateCartItem(id, updateCartItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  removeFromCart(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cartService.removeFromCart(id);
  }

  @Delete('clear/:sessionId')
  @ApiOperation({ summary: 'Limpar carrinho' })
  @ApiResponse({ status: 200, description: 'Carrinho limpo com sucesso' })
  clearCart(@Param('sessionId') sessionId: string): Promise<void> {
    return this.cartService.clearCart(sessionId);
  }
}
