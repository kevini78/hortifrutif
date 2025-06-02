import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { OrdersService } from "../orders/orders.service"; // Corrected path
import { OrderStatus, Order } from "../orders/entities/order.entity"; // Import OrderStatus and Order

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private ordersService: OrdersService, // Inject OrdersService
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: number): Promise<Review> {
    // 1. Verify the order exists and belongs to the user using the injected OrdersService
    // The findOne method in OrdersService now throws if not found or not belonging to the user.
    const order: Order = await this.ordersService.findOne(createReviewDto.orderId, userId);
    // If findOne didn't throw, order is guaranteed to be non-null and belong to the user.

    // 2. Check if the order status allows reviewing (must be DELIVERED)
    if (order.status !== OrderStatus.DELIVERED) {
        throw new BadRequestException(`Só é possível avaliar pedidos com status '${OrderStatus.DELIVERED}'. Status atual: ${order.status}`);
    }

    // 3. Check if the user has already reviewed this order
    const existingReview = await this.reviewsRepository.findOne({ where: { orderId: createReviewDto.orderId, userId } });
    if (existingReview) {
      throw new ConflictException('Você já avaliou este pedido.');
    }

    // 4. Create and save the review
    const review = this.reviewsRepository.create({
      ...createReviewDto,
      userId,
      // No need to explicitly link order here, TypeORM handles it via orderId
    });
    return await this.reviewsRepository.save(review);
  }

  async findAllByOrder(orderId: number): Promise<Review[]> {
    // Optional: Add check if the requesting user should see reviews for this order
    return await this.reviewsRepository.find({ where: { orderId }, relations: ['user'] }); // Load user relation
  }

  async findAllByUser(userId: number): Promise<Review[]> {
    return await this.reviewsRepository.find({ where: { userId }, relations: ['order'] }); // Include order details
  }

  // Optional: Find a specific review by ID
  // This method doesn't check ownership by default, returns null if not found.
  async findOne(id: number): Promise<Review | null> {
      return await this.reviewsRepository.findOne({ where: { id }, relations: ['order', 'user'] });
  }

  // Optional: Find a specific review by ID, ensuring ownership.
  async findOneByUser(id: number, userId: number): Promise<Review> { // Throws if not found or not owned
      const review = await this.reviewsRepository.findOne({ where: { id, userId }, relations: ['order', 'user'] });
      if (!review) {
          throw new NotFoundException(`Avaliação com ID ${id} não encontrada ou não pertence a você.`);
      }
      return review;
  }

  // Optional: Delete a review (only by the user who wrote it)
  async remove(id: number, userId: number): Promise<void> {
      // Use findOneByUser to ensure ownership before deleting
      const review = await this.findOneByUser(id, userId);
      // findOneByUser throws if not found/owned

      const result = await this.reviewsRepository.delete(id);
      if (result.affected === 0) {
          // Should not happen if findOneByUser found it, but good practice
          throw new NotFoundException(`Falha ao deletar avaliação com ID ${id}.`);
      }
  }
}
