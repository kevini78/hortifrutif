import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Address } from '../../adress/entities/adress.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}