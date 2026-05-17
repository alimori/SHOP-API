// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { Order } from './entities/order.entity';
// import { Product } from '../product/entities/product.entity';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';

// @Injectable()
// export class OrderService {

//   constructor(
//     @InjectRepository(Order)
//     private orderRepo: Repository<Order>,

//     @InjectRepository(Product)
//     private productRepo: Repository<Product>,
//   ) { }

//   async create(dto: CreateOrderDto) {

//     // 1. Find product
//     const product = await this.productRepo.findOne({
//       where: { id: dto.productId },
//     });

//     // 2. Handle null safely (IMPORTANT FIX)
//     if (!product) {
//       throw new NotFoundException('Product not found');
//     }

//     // 3. Create order (TypeORM safe typing)
//     const order = this.orderRepo.create({
//       quantity: dto.quantity,
//       product: product,
//     });

//     // 4. Save
//     return this.orderRepo.save(order);
//   }

//   async update(
//     id: number,
//     dto: UpdateOrderDto,
//   ) {

//     const product = await this.productRepo.findOne({
//       where: {
//         id: dto.productId,
//       },
//     });

//     if (!product) {
//       throw new NotFoundException(
//         'Product not found',
//       );
//     }

//     const order = await this.orderRepo.preload({
//       id,
//       quantity: dto.quantity,
//       product,
//     });

//     if (!order) {
//       throw new NotFoundException(
//         'Order not found',
//       );
//     }

//     return this.orderRepo.save(order);
//   }

//   async remove(id: number) {
//     const order = await this.orderRepo.findOne({ where: { id } });

//     if (!order) {
//       throw new NotFoundException('Order not found');
//     }

//     return this.orderRepo.remove(order);
//   }

//   findAll() {
//     return this.orderRepo.find({
//       relations: ['product'],
//     });
//   }

//   async findByProduct(productId: number) {

//     return this.orderRepo.find({
//       where: {
//         product: {
//           id: productId,
//         },
//       },

//       relations: ['product'],
//     });
//   }

// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OutboxEvent } from 'src/outbox/entities/outbox-event.entity';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    private dataSource: DataSource
  ) { }

  async create(dto: CreateOrderDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOne(
        Product,
        {
          where: {
            id: dto.productId,
          },
        },
      );

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const order = queryRunner.manager.create(
        Order,
        {
          quantity: dto.quantity,
          product,
        },
      );

      const savedOrder = await queryRunner.manager.save(order);

      await queryRunner.manager.save(
        OutboxEvent,
        {
          type: 'order.created',
          payload:
            JSON.stringify({
              orderId: savedOrder.id,
              quantity: savedOrder.quantity,
              productId: product.id,
              productTitle: product.title,
              totalPrice: product.price * savedOrder.quantity
            }),
        },
      );

      await queryRunner.commitTransaction();

      return savedOrder;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, dto: UpdateOrderDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingOrder = await queryRunner.manager.findOne(
        Order,
        {
          where: { id },

          relations: ['product'],
        },
      );

      if (!existingOrder) {
        throw new NotFoundException('Order not found');
      }

      const product = await queryRunner.manager.findOne(
        Product,
        {
          where: {
            id: dto.productId,
          },
        },
      );

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const oldQuantity = existingOrder.quantity;
      const oldProductTitle = existingOrder.product.title;
      const oldTotal = existingOrder.quantity * existingOrder.product.price;
      existingOrder.quantity = dto.quantity ?? 0;
      existingOrder.product = product;

      const updatedOrder = await queryRunner.manager.save(existingOrder);
      const newTotal = updatedOrder.quantity * product.price;

      await queryRunner.manager.save(
        OutboxEvent,
        {
          type: 'order.updated',

          payload: JSON.stringify({
            orderId: updatedOrder.id,
            quantity: updatedOrder.quantity,
            productId: product.id,
            productTitle: product.title,
            totalPrice: newTotal,

            changes: {
              quantity: {
                from: oldQuantity,
                to: updatedOrder.quantity,
              },

              product: {
                from: oldProductTitle,
                to: product.title,
              },

              totalPrice: {
                from: oldTotal,
                to: newTotal,
              },
            },
          }),
        },
      );

      await queryRunner.commitTransaction();
      return updatedOrder;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const order = await queryRunner.manager.findOne(
        Order,
        {
          where: { id },
          relations: ['product'],
        },
      );

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const payload = {
        orderId: order.id,
        quantity: order.quantity,
        productId: order.product.id,
        productTitle: order.product.title,
        totalPrice: order.quantity * order.product.price,
      };

      await queryRunner.manager.remove(order);

      await queryRunner.manager.save(
        OutboxEvent,
        {
          type: 'order.deleted',
          payload: JSON.stringify(payload),
        },
      );

      await queryRunner.commitTransaction();

      return { message: 'Order deleted' };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  findAll() {
    return this.orderRepo.find({
      relations: ['product'],
    });
  }

  async findByProduct(productId: number) {

    return this.orderRepo.find({
      where: {
        product: {
          id: productId,
        },
      },

      relations: ['product'],
    });
  }

}