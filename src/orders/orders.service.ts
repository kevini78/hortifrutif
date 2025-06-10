import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';
import { UsersService } from '../users/users.service';
import { AddressService } from '../adress/adress.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private cartService: CartService,
    private usersService: UsersService,
    private addressService: AddressService,
    private configService: ConfigService,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const address = await this.addressService.findOne(createOrderDto.addressId, userId);
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Endereço não encontrado ou não pertence ao usuário');
    }

    const cart = await this.cartService.getCartByUserId(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Carrinho vazio');
    }

    const order = this.ordersRepository.create({
      user,
      address,
      status: 'pending',
      items: cart.items.map((cartItem) => {
        const orderItem = this.orderItemsRepository.create({
          produto: cartItem.produto,
          quantity: cartItem.quantity,
          price: cartItem.produto.preco,
        });
        return orderItem;
      }),
    });

    const savedOrder = await this.ordersRepository.save(order);
    await this.cartService.clearCart(userId);

    savedOrder.items = savedOrder.items.map((item) => ({
      ...item,
      produto: {
        ...item.produto,
        imageUrl: item.produto.imagePath
          ? `${this.configService.get('APP_URL')}/uploads/${item.produto.imagePath}`
          : null,
      },
    }));

    return savedOrder;
  }

  async findAllByUser(userId: number): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.produto', 'address'],
    });

    return orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        produto: {
          ...item.produto,
          imageUrl: item.produto.imagePath
            ? `${this.configService.get('APP_URL')}/uploads/${item.produto.imagePath}`
            : null,
        },
      })),
    }));
  }

  async findOne(id: number, userId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['items', 'items.produto', 'address'],
    });
    if (!order) {
      throw new NotFoundException('Pedido não encontrado ou não pertence ao usuário');
    }

    order.items = order.items.map((item) => ({
      ...item,
      produto: {
        ...item.produto,
        imageUrl: item.produto.imagePath
          ? `${this.configService.get('APP_URL')}/uploads/${item.produto.imagePath}`
          : null,
      },
    }));

    return order;
  }

  async confirmPayment(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }
    if (order.status !== 'pending') {
      throw new BadRequestException('Pedido não está pendente');
    }
    order.status = 'paid';
    return this.ordersRepository.save(order);
  }

  async cancelOrder(id: number, userId: number): Promise<Order> {
    const order = await this.findOne(id, userId);
    if (order.status !== 'pending') {
      throw new BadRequestException('Somente pedidos pendentes podem ser cancelados');
    }
    order.status = 'cancelled';
    return this.ordersRepository.save(order);
  }
}