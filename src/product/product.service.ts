import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private productRepo: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
    ) { }


    async create(dto: CreateProductDto) {

        const categories =
            await this.categoryRepo.findBy({
                id: In(dto.categoryIds),
            });

        const product =
            this.productRepo.create({
                title: dto.title,
                price: dto.price,
                categories,
            });

        return this.productRepo.save(product);
    }

    async findAll(skip = 0, limit = 10) {

        const [data, total] =
            await this.productRepo.findAndCount({
                skip,
                take: limit,
            });

        return {
            data,
            total,
            skip,
            limit,
        };
    }


    async findOne(id: number) {

        const product =
            await this.productRepo.findOne({
                where: { id },

                relations: ['categories'],
            });

        if (!product) {
            throw new NotFoundException(
                'Product not found',
            );
        }

        return product;
    }

    async update(id: number, dto: CreateProductDto) {
        const product = await this.productRepo.preload({
            id: +id,
            ...dto
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const categories =
            await this.categoryRepo.findBy({
                id: In(dto.categoryIds),
            });
        product.categories = [...categories];

        return this.productRepo.save(product);
    }



    async remove(id: number) {
        const product = await this.productRepo.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return this.productRepo.remove(product);
    }

}

