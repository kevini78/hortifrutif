import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Produto } from '../../produtos/entities/produto.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID do item do pedido', example: 1 })
  id: number;

  @ManyToOne(() => Order, (order) => order.items)
  @ApiProperty({ description: 'Pedido ao qual o item pertence' })
  order: Order;

  @ManyToOne(() => Produto)
  @ApiProperty({ description: 'Produto no pedido', nullable: true })
  produto?: Produto;

  @Column()
  @ApiProperty({ description: 'Quantidade do produto', example: 2 })
  quantity: number;

  @Column('decimal')
  @ApiProperty({ description: 'Preço unitário do produto', example: 5.99 })
  price: number;
}