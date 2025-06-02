import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from '../users/entities/user.entity'; // Assuming User entity exists
import { ProdutosService } from '../produtos/produtos.service';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private produtosService: ProdutosService,
  ) {}

  // Corrected return type to Promise<Cart | null> or handle null case
  async getCartByUserId(userId: number, createIfNotExist: boolean = true): Promise<Cart | null> {
    let cart = await this.cartRepository.findOne({ where: { userId }, relations: ['items', 'items.produto'] }); // Eager load items and their products

    if (!cart && createIfNotExist) {
      // Create a new cart if one doesn't exist for the user
      cart = this.cartRepository.create({ userId, items: [] });
      await this.cartRepository.save(cart);
      // Re-fetch the cart to ensure relations are loaded correctly
      cart = await this.cartRepository.findOne({ where: { userId }, relations: ['items', 'items.produto'] });
    }

    // If still no cart (e.g., createIfNotExist was false), return null
    if (!cart) {
        return null;
    }

    // Calculate total price (optional, can be done on frontend or here)
    // cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantidade * item.precoUnitario, 0);
    return cart;
  }

  async addItemToCart(userId: number, addItemDto: AddItemToCartDto): Promise<Cart> {
    // Ensure cart exists by calling getCartByUserId with createIfNotExist = true (default)
    const cart = await this.getCartByUserId(userId);
    if (!cart) {
        // This should not happen if createIfNotExist is true, but handle defensively
        throw new NotFoundException('Carrinho não encontrado para o usuário.');
    }
    const produto = await this.produtosService.findOne(addItemDto.produtoId);

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${addItemDto.produtoId} não encontrado.`);
    }

    if (produto.estoque < addItemDto.quantidade) {
      throw new BadRequestException(`Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.estoque}`);
    }

    let cartItem = await this.cartItemRepository.findOne({ where: { cartId: cart.id, produtoId: produto.id } });

    if (cartItem) {
      // Update quantity if item already exists
      const newQuantity = cartItem.quantidade + addItemDto.quantidade;
      if (produto.estoque < newQuantity) {
         throw new BadRequestException(`Estoque insuficiente para adicionar mais ${addItemDto.quantidade} do produto ${produto.nome}. Total solicitado: ${newQuantity}, Disponível: ${produto.estoque}`);
      }
      cartItem.quantidade = newQuantity;
    } else {
      // Create new cart item
      cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        produtoId: produto.id,
        quantidade: addItemDto.quantidade,
        precoUnitario: produto.preco, // Store price at the time of adding
      });
    }

    await this.cartItemRepository.save(cartItem);

    // Re-fetch the cart to get updated items
    const updatedCart = await this.getCartByUserId(userId, false); // Don't create again
    if (!updatedCart) {
        throw new NotFoundException('Carrinho não encontrado após adicionar item.'); // Should not happen
    }
    return updatedCart;
  }

  async removeItemFromCart(userId: number, cartItemId: number): Promise<Cart> {
    const cart = await this.getCartByUserId(userId, false); // Don't create if not exists
    if (!cart) {
        throw new NotFoundException('Carrinho não encontrado para o usuário.');
    }
    const cartItem = await this.cartItemRepository.findOne({ where: { id: cartItemId, cartId: cart.id } });

    if (!cartItem) {
      throw new NotFoundException(`Item do carrinho com ID ${cartItemId} não encontrado ou não pertence a este carrinho.`);
    }

    await this.cartItemRepository.remove(cartItem);

    // Re-fetch the cart to get updated items
    const updatedCart = await this.getCartByUserId(userId, false);
    if (!updatedCart) {
        throw new NotFoundException('Carrinho não encontrado após remover item.'); // Should not happen
    }
    return updatedCart;
  }

  async updateItemQuantity(userId: number, cartItemId: number, newQuantity: number): Promise<Cart> {
      const cart = await this.getCartByUserId(userId, false); // Don't create if not exists
      if (!cart) {
          throw new NotFoundException('Carrinho não encontrado para o usuário.');
      }

      if (newQuantity <= 0) {
          // If quantity is zero or less, remove the item
          return this.removeItemFromCart(userId, cartItemId);
      }

      const cartItem = await this.cartItemRepository.findOne({ where: { id: cartItemId, cartId: cart.id }, relations: ['produto'] });

      if (!cartItem) {
          throw new NotFoundException(`Item do carrinho com ID ${cartItemId} não encontrado ou não pertence a este carrinho.`);
      }

      const produto = cartItem.produto;
      if (!produto) {
          throw new NotFoundException(`Produto associado ao item ${cartItemId} não encontrado.`);
      }

      if (produto.estoque < newQuantity) {
          throw new BadRequestException(`Estoque insuficiente para o produto ${produto.nome}. Solicitado: ${newQuantity}, Disponível: ${produto.estoque}`);
      }

      cartItem.quantidade = newQuantity;
      await this.cartItemRepository.save(cartItem);

      const updatedCart = await this.getCartByUserId(userId, false);
      if (!updatedCart) {
          throw new NotFoundException('Carrinho não encontrado após atualizar quantidade.'); // Should not happen
      }
      return updatedCart;
  }

  async clearCart(userId: number): Promise<void> {
      const cart = await this.getCartByUserId(userId, false);
      if (cart) {
        // Remove all items associated with this cart
        await this.cartItemRepository.delete({ cartId: cart.id });
      }
      // No error if cart doesn't exist, just do nothing
  }
}
