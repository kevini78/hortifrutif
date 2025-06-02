import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Corrected path
import { Order } from '../../orders/entities/order.entity'; // Corrected path
import { Produto } from '../../produtos/entities/produto.entity'; // Corrected path

@Entity({ name: 'reviews' })
export class Review { // Ensure class is exported
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  // Review is linked to a specific Order
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: number;

  // Optional: Link directly to a Product (if needed)
  // @ManyToOne(() => Produto)
  // @JoinColumn({ name: 'produtoId' })
  // produto?: Produto;
  // @Column({ nullable: true })
  // produtoId?: number;

  @Column({ type: 'int' }) // Rating from 1 to 5
  rating: number;

  @Column('text', { nullable: true })
  comment?: string;

  @CreateDateColumn()
  createdAt: Date;
}