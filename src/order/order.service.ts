// import { Injectable } from '@nestjs/common';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';

// @Injectable()
// export class OrderService {
//   create(createOrderDto: CreateOrderDto) {
//     return 'This action adds a new order';
//   }

//   findAll() {
//     return `This action returns all order`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} order`;
//   }

//   update(id: number, updateOrderDto: UpdateOrderDto) {
//     return `This action updates a #${id} order`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} order`;
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) { }

  async create(dto: CreateOrderDto) {

    // 1. Find product
    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });

    // 2. Handle null safely (IMPORTANT FIX)
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 3. Create order (TypeORM safe typing)
    const order = this.orderRepo.create({
      quantity: dto.quantity,
      product: product,
    });

    // 4. Save
    return this.orderRepo.save(order);
  }


  async update(id: number, dto: CreateOrderDto) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    order.quantity = dto.quantity;
    order.product = product;

    return this.orderRepo.save(order);
  }

  async remove(id: number) {
    const order = await this.orderRepo.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.orderRepo.remove(order);
  }

  findAll() {
    return this.orderRepo.find({
      relations: ['product'],
    });
  }

}