import { Controller, Post, Body, Get, Put, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders') // 👈 group in Swagger UI
@Controller('orders')
export class OrderController {

  constructor(private readonly orderService: OrderService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
  })
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with product relation' })
  findAll() {
    return this.orderService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update order' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Find by product' })
  findByProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.orderService.findByProduct(productId);
  }


}