import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Produto } from "../../produtos/entities/produto.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: "ID único do item no carrinho" })
  id: number;

  @Column()
  @ApiProperty({ example: 1, description: "ID do carrinho ao qual o item pertence" })
  cartId: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" }) // Cascade delete if cart is deleted
  @JoinColumn({ name: "cartId" })
  cart: Cart;

  @Column()
  @ApiProperty({ example: 5, description: "ID do produto adicionado ao carrinho" })
  produtoId: number;

  @ManyToOne(() => Produto, { eager: true }) // Eager load product details
  @JoinColumn({ name: "produtoId" })
  produto: Produto;

  @Column("int")
  @ApiProperty({ example: 3, description: "Quantidade do produto no carrinho" })
  quantidade: number; // Standardized to Portuguese

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) // Added precoUnitario
  @ApiProperty({ example: 5.99, description: "Preço unitário do produto no momento da adição ao carrinho", required: false })
  precoUnitario?: number; // Price at the time of adding to cart (optional, could rely on produto.preco)
}