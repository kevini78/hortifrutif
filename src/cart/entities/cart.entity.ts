import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../produ/product.entity';

@Entity()
export class CartItem {
  @ApiProperty({ description: 'ID único do item do carrinho' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID da sessão do usuário' })
  @Column()
  sessionId: string;

  @ApiProperty({ description: 'Produto no carrinho' })
  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @ApiProperty({ description: 'Quantidade do produto' })
  @Column()
  quantity: number;

  @ApiProperty({ description: 'Preço unitário no momento da adição' })
  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}