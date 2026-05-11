// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { OrderService } from './order.service';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';

// @Controller('order')
// export class OrderController {
//   constructor(private readonly orderService: OrderService) {}

//   @Post()
//   create(@Body() createOrderDto: CreateOrderDto) {
//     return this.orderService.create(createOrderDto);
//   }

//   @Get()
//   findAll() {
//     return this.orderService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.orderService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
//     return this.orderService.update(+id, updateOrderDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.orderService.remove(+id);
//   }
// }

import { Controller, Post, Body, Get, Put, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

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
    @Body() dto: CreateOrderDto,
  ) {
    return this.orderService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }

}