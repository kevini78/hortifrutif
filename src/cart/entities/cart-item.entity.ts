import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Cart } from './cart.entity';
import { Produto } from '../../produtos/entities/produto.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID do item do carrinho', example: 1 })
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @ApiProperty({ description: 'Carrinho ao qual o item pertence' })
  cart: Cart;

  @ManyToOne(() => Produto)
  @ApiProperty({ description: 'Produto no carrinho' })
  produto: Produto;

  @Column()
  @ApiProperty({ description: 'Quantidade do produto', example: 2 })
  quantity: number;
}