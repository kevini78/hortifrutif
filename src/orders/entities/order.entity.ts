import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Address } from '../../adress/entities/adress.entity';

export const OrderStatus = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column()
  addressId: number;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @Column({
    type: 'varchar',
    length: 50,
    default: OrderStatus.PENDING_PAYMENT,
  })
  status: string;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ nullable: true })
  trackingCode?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}