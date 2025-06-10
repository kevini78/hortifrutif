import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @ApiProperty({ description: 'ID único do produto' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nome do produto' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Descrição do produto' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Preço do produto' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Categoria do produto' })
  @Column()
  category: string;

  @ApiProperty({ description: 'Quantidade em estoque' })
  @Column()
  stock: number;

  @ApiProperty({ description: 'URL da imagem do produto' })
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty({ description: 'Indica se o produto está ativo' })
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
