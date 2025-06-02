import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';
import { ProdutosService } from '../produtos/produtos.service';
import { AddressService } from '../adress/adress.service';
import { Produto } from '../produtos/entities/produto.entity';
import { Address } from '../adress/entities/adress.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private cartService: CartService,
    private produtosService: ProdutosService,
    private addressService: AddressService,
    private dataSource: DataSource,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await this.cartService.getCartByUserId(userId);
      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('O carrinho está vazio.');
      }

      const address: Address | null = await this.addressService.findOne(createOrderDto.addressId, userId);
      if (!address) {
        throw new NotFoundException(`Endereço com ID ${createOrderDto.addressId} não encontrado ou não pertence ao usuário.`);
      }

      let totalAmount = 0;
      const orderItemsData: Partial<OrderItem>[] = [];

      for (const cartItem of cart.items) {
        const produto: Produto | null = await this.produtosService.findOne(cartItem.produtoId);
        if (!produto) {
          throw new NotFoundException(`Produto com ID ${cartItem.produtoId} não encontrado.`);
        }
        if (produto.estoque < cartItem.quantidade) {
          throw new BadRequestException(`Estoque insuficiente para o produto: ${produto.nome} (ID: ${produto.id}). Disponível: ${produto.estoque}, Solicitado: ${cartItem.quantidade}`);
        }

        totalAmount += produto.preco * cartItem.quantidade;
        orderItemsData.push({
          produtoId: cartItem.produtoId,
          quantidade: cartItem.quantidade,
          precoUnitario: produto.preco,
          nomeProduto: produto.nome,
        });

        produto.estoque -= cartItem.quantidade;
        await queryRunner.manager.save(Produto, produto);
      }

      const order = queryRunner.manager.create(Order, {
        userId,
        addressId: createOrderDto.addressId,
        totalAmount,
        status: OrderStatus.PENDING_PAYMENT,
        paymentMethod: createOrderDto.paymentMethod,
        items: orderItemsData.map(itemData => queryRunner.manager.create(OrderItem, itemData)),
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      await this.cartService.clearCart(userId);

      await queryRunner.commitTransaction();

      return await this.ordersRepository.findOneOrFail({ where: { id: savedOrder.id }, relations: ['items', 'address', 'items.produto'] });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByUser(userId: number): Promise<Order[]> {
    return await this.ordersRepository.find({ where: { userId }, relations: ['items', 'address', 'items.produto'] });
  }

  async findOne(id: number, userId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id, userId }, relations: ['items', 'address', 'items.produto'] });
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado ou não pertence ao usuário.`);
    }
    return order;
  }

  async findOneById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id }, relations: ['items', 'address', 'items.produto'] });
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
    }
    return order;
  }

  async confirmPayment(id: number): Promise<Order> {
    const order = await this.findOneById(id);
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(`Só é possível confirmar pagamento de pedidos com status ${OrderStatus.PENDING_PAYMENT}.`);
    }
    order.status = OrderStatus.PROCESSING;
    return await this.ordersRepository.save(order);
  }

  async cancelOrder(id: number, userId: number): Promise<Order> {
    const order = await this.findOne(id, userId);

    if (order.status !== OrderStatus.PENDING_PAYMENT && order.status !== OrderStatus.PROCESSING) {
      throw new BadRequestException(`Não é possível cancelar um pedido com status ${order.status}.`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const item of order.items) {
        await queryRunner.manager.increment(Produto, { id: item.produtoId }, 'estoque', item.quantidade);
      }
      order.status = OrderStatus.CANCELLED;
      const updatedOrder = await queryRunner.manager.save(Order, order);
      await queryRunner.commitTransaction();
      return updatedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
