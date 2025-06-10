import { Controller, Get, Post, Body, Param, Delete, Req, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';

@ApiTags('orders')
@Controller('orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Req() request: Request, @Body() createOrderDto: CreateOrderDto) {
    const user = request.user as User;
    return this.ordersService.create(user.id, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for a user' })
  @ApiResponse({ status: 200, description: 'List of orders' })
  async findAll(@Req() request: Request) {
    const user = request.user as User;
    return this.ordersService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({ status: 200, description: 'Order details' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    const user = request.user as User;
    return this.ordersService.findOne(id, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async cancel(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    const user = request.user as User;
    return this.ordersService.cancelOrder(id, user.id);
  }
}