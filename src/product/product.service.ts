import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from 'src/category/entities/category.entity';
import { OutboxEvent } from 'src/outbox/entities/outbox-event.entity';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private productRepo: Repository<Product>,

        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,

        private dataSource: DataSource,
    ) { }


    async create(dto: CreateProductDto) {

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const categories = await queryRunner.manager.findBy(
                Category,
                {
                    id: In(dto.categoryIds),
                },
            );

            const product = queryRunner.manager.create(
                Product,
                {
                    title: dto.title,
                    price: dto.price,
                    categories,
                },
            );

            const savedProduct = await queryRunner.manager.save(product,);

            await queryRunner.manager.save(
                OutboxEvent,
                {
                    type: 'product.created',

                    payload: JSON.stringify({
                        productId: savedProduct.id,
                        title: savedProduct.title,
                    }),
                },
            );

            await queryRunner.commitTransaction();
            return savedProduct;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;

        } finally {
            await queryRunner.release();
        }
    }

    async findAll(skip = 0, limit = 10) {

        const [data, total] =
            await this.productRepo.findAndCount({
                skip,
                take: limit,
            });

        return {
            items: data,
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

    // async update(id: number, dto: CreateProductDto) {
    //     const product = await this.productRepo.preload({
    //         id: +id,
    //         ...dto
    //     });

    //     if (!product) {
    //         throw new NotFoundException('Product not found');
    //     }

    //     const categories =
    //         await this.categoryRepo.findBy({
    //             id: In(dto.categoryIds),
    //         });
    //     product.categories = [...categories];

    //     return this.productRepo.save(product);
    // }

    async update(id: number, dto: CreateProductDto) {

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const existingProduct = await queryRunner.manager.findOne(
                Product,
                {
                    where: { id },

                    relations: ['categories'],
                },
            );

            if (!existingProduct) {
                throw new NotFoundException(
                    'Product not found',
                );
            }

            const oldValues = {
                title: existingProduct.title,
                price: existingProduct.price,
            };

            const categories =
                await queryRunner.manager.findBy(
                    Category,
                    {
                        id: In(dto.categoryIds),
                    },
                );

            existingProduct.title = dto.title;

            existingProduct.price = dto.price;

            existingProduct.categories =
                categories;

            const updatedProduct = await queryRunner.manager.save(existingProduct);

            // SAVE OUTBOX EVENT
            await queryRunner.manager.save(
                OutboxEvent,
                {
                    type: 'product.updated',
                    payload: JSON.stringify({
                        productId: updatedProduct.id,
                        oldValues,
                        newValues: {
                            title: updatedProduct.title,
                            price: updatedProduct.price,
                        },
                    }),
                },
            );

            await queryRunner.commitTransaction();
            return updatedProduct;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // async remove(id: number) {
    //     const product = await this.productRepo.findOne({ where: { id } });

    //     if (!product) {
    //         throw new NotFoundException('Product not found');
    //     }

    //     return this.productRepo.remove(product);
    // }

    async remove(id: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const product = await queryRunner.manager.findOne(
                Product,
                {
                    where: { id },
                },
            );

            if (!product) {
                throw new NotFoundException(
                    'Product not found',
                );
            }

            const deletedProductData = {
                id: product.id,
                title: product.title,
                price: product.price,
            };

            await queryRunner.manager.remove(
                product,
            );

            // SAVE OUTBOX EVENT
            await queryRunner.manager.save(
                OutboxEvent,
                {
                    type: 'product.deleted',

                    payload: JSON.stringify(
                        deletedProductData,
                    ),
                },
            );
            await queryRunner.commitTransaction();
            return { message: 'Product deleted successfully', };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

}

