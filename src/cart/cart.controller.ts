import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';

@ApiTags('cart')
@Controller('cart')
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-item')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async addItemToCart(@Req() request: Request, @Body() addItemToCartDto: AddItemToCartDto) {
    const user = request.user as User;
    return this.cartService.addItemToCart(user, addItemToCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async getCart(@Req() request: Request) {
    const user = request.user as User;
    return this.cartService.getCart(user);
  }

  @Patch('item/:itemId/quantity/:quantity')
  @ApiOperation({ summary: 'Update item quantity in cart' })
  @ApiResponse({ status: 200, description: 'Item quantity updated' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async updateItemQuantity(
    @Req() request: Request,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Param('quantity', ParseIntPipe) quantity: number,
  ) {
    const user = request.user as User;
    return this.cartService.updateItemQuantity(user.id, itemId, quantity);
  }

  @Delete('item/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async removeItemFromCart(@Req() request: Request, @Param('itemId', ParseIntPipe) itemId: number) {
    const user = request.user as User;
    return this.cartService.removeItemFromCart(user.id, itemId);
  }
}