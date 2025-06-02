import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProdutosModule } from './produtos/produtos.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { AddressModule } from './adress/adress.module';
import { ReviewsModule } from './reviews/reviews.module';
import { User } from './users/entities/user.entity';
import { Produto } from './produtos/entities/produto.entity';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cart-item.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { Address } from './adress/entities/adress.entity';
import { Review } from './reviews/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [
        User,
        Produto,
        Cart,
        CartItem,
        Order,
        OrderItem,
        Address,
        Review,
      ],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    ProdutosModule,
    CartModule,
    OrdersModule,
    AddressModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
