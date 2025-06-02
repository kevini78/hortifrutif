import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./entities/cart.entity";
import { CartItem } from "./entities/cart-item.entity";
import { ProdutosModule } from "../produtos/produtos.module"; // Import ProdutosModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]), // Register Cart and CartItem repositories
    ProdutosModule, // Import ProdutosModule to use ProdutosService
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService], // Export CartService if needed by other modules (e.g., OrdersModule)
})
export class CartModule {}
