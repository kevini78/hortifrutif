import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { OrderItem } from "../../orders/entities/order-item.entity";
import { CartItem } from "../../cart/entities/cart-item.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: "ID único do produto" })
  id: number;

  @Column({ length: 100 })
  @ApiProperty({ example: "Maçã Gala", description: "Nome do produto", maxLength: 100 })
  nome: string; // Standardized to Portuguese

  @Column("text", { nullable: true })
  @ApiProperty({ example: "Maçã doce e crocante, ideal para consumo in natura.", description: "Descrição detalhada do produto", required: false })
  descricao?: string; // Standardized to Portuguese

  @Column("decimal", { precision: 10, scale: 2 })
  @ApiProperty({ example: 5.99, description: "Preço unitário do produto" })
  preco: number; // Standardized to Portuguese

  @Column({ default: "unidade" }) // e.g., unidade, kg, bandeja
  @ApiProperty({ example: "kg", description: "Unidade de medida para venda", default: "unidade" })
  unidade: string; // Standardized to Portuguese

  @Column("int", { default: 0 })
  @ApiProperty({ example: 100, description: "Quantidade em estoque", default: 0 })
  estoque: number; // Standardized to Portuguese

  @Column({ nullable: true })
  @ApiProperty({ example: "/images/maca_gala.jpg", description: "URL da imagem do produto", required: false })
  imageUrl?: string;

  @CreateDateColumn()
  @ApiProperty({ description: "Data de criação do registro" })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: "Data da última atualização do registro" })
  updatedAt: Date;

  // Relationships (optional, depending on if you need to navigate from Produto)
  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.produto)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem: CartItem) => cartItem.produto)
  cartItems: CartItem[];
}