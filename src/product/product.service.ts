import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private productRepo: Repository<Product>,
    ) { }

    create(dto: CreateProductDto) {
        const product = this.productRepo.create(dto);
        return this.productRepo.save(product);
    }

    findAll() {
        return this.productRepo.find();
    }

    async update(id: number, dto: CreateProductDto) {
        const product = await this.productRepo.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        Object.assign(product, dto);

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

