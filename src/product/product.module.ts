import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { OutboxEvent } from 'src/outbox/entities/outbox-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, OutboxEvent]),
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule { }
