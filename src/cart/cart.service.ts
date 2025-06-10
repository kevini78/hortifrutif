import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProdutosService } from '../produtos/produtos.service';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private produtosService: ProdutosService,
    private configService: ConfigService,
  ) {}

  async addItemToCart(user: User, addItemDto: AddItemToCartDto): Promise<Cart> {
    const { productId, quantity } = addItemDto;
    const produto = await this.produtosService.findOne(productId);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    let cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items', 'items.produto'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user, items: [] });
      cart = await this.cartRepository.save(cart);
    }

    const existingItem = cart.items.find((item) => item.produto.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const cartItem = this.cartItemRepository.create({
        cart,
        produto,
        quantity,
      });
      await this.cartItemRepository.save(cartItem);
      cart.items.push(cartItem);
    }

    const updatedCart = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.produto'],
    });
    if (!updatedCart) {
      throw new NotFoundException('Carrinho não encontrado após atualização');
    }

    updatedCart.items = updatedCart.items.map((item) => ({
      ...item,
      produto: {
        ...item.produto,
        imageUrl: item.produto.imagePath
          ? `${this.configService.get('APP_URL')}/uploads/${item.produto.imagePath}`
          : null,
      },
    }));

    return updatedCart;
  }

  async getCart(user: User): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items', 'items.produto'],
    });
    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    cart.items = cart.items.map((item) => ({
      ...item,
      produto: {
        ...item.produto,
        imageUrl: item.produto.imagePath
          ? `${this.configService.get('APP_URL')}/uploads/${item.produto.imagePath}`
          : null,
      },
    }));

    return cart;
  }

  async getCartByUserId(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.produto'],
    });
    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    cart.items = cart.items.map((item) => ({
      ...item,
      produto: {
        ...item.produto,
        imageUrl: item.produto.imagePath
          ? `${this.configService.get('APP_URL')}/uploads/${item.produto.imagePath}`
          : null,
      },
    }));

    return cart;
  }

  async updateItemQuantity(userId: number, itemId: number, quantity: number): Promise<Cart> {
    const cart = await this.getCartByUserId(userId);
    const item = cart.items.find((item) => item.id === itemId);
    if (!item) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }
    if (quantity <= 0) {
      await this.cartItemRepository.delete({ id: itemId });
      cart.items = cart.items.filter((i) => i.id !== itemId);
    } else {
      item.quantity = quantity;
      await this.cartItemRepository.save(item);
    }

    const updatedCart = await this.getCartByUserId(userId);
    return updatedCart;
  }

  async removeItemFromCart(userId: number, itemId: number): Promise<Cart> {
    const cart = await this.getCartByUserId(userId);
    const item = cart.items.find((item) => item.id === itemId);
    if (!item) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }
    await this.cartItemRepository.delete({ id: itemId });
    cart.items = cart.items.filter((i) => i.id !== itemId);

    const updatedCart = await this.getCartByUserId(userId);
    return updatedCart;
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.getCartByUserId(userId);
    await this.cartItemRepository.delete({ cart: { id: cart.id } });
  }
}