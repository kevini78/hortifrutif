import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Produto } from '../../produtos/entities/produto.entity'; // Corrected path

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: number;

  // Link to the product snapshot at the time of order
  @ManyToOne(() => Produto, { eager: true, onDelete: 'SET NULL', nullable: true }) // Allow product to be deleted without deleting order item
  @JoinColumn({ name: 'produtoId' })
  produto?: Produto; // Make optional in case product is deleted

  @Column({ nullable: true }) // Allow null if product is deleted
  produtoId?: number;

  @Column()
  quantidade: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precoUnitario: number; // Price at the time of order

  @Column()
  nomeProduto: string; // Store product name snapshot
}