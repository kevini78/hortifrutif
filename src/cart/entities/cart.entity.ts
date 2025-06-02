import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Corrected path
import { CartItem } from './cart-item.entity'; // Corrected path relative to this file

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  // Link to the user who owns the cart
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  // Items in the cart
  @OneToMany(() => CartItem, (item: CartItem) => item.cart, { cascade: true, eager: true }) // Added type hint
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}