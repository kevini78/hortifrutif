import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartModule } from '../cart/cart.module';
import { ProdutosModule } from '../produtos/produtos.module';
import { AddressModule } from '../adress/adress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CartModule,
    ProdutosModule,
    AddressModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
