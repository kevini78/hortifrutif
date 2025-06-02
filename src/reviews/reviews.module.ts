import { Module } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./entities/review.entity";
import { OrdersModule } from "../orders/orders.module"; // Import OrdersModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]), // Register Review repository
    OrdersModule, // Import OrdersModule to use OrdersService
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

