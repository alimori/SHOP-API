import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';

describe('ProductService', () => {

  let service: ProductService;
  let productRepo: jest.Mocked<Repository<Product>>;
  let categoryRepo: jest.Mocked<Repository<Category>>;

  beforeEach(async () => {

    const module: TestingModule =
      await Test.createTestingModule({

        providers: [
          ProductService,

          {
            provide:
              getRepositoryToken(Product),

            useValue: {
              find: jest.fn(),
              findOne: jest.fn(),
              findAndCount: jest.fn(),
              create: jest.fn(),
              save: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              remove: jest.fn(),
              preload: jest.fn(),
            },
          },

          {
            provide:
              getRepositoryToken(Category),

            useValue: {
              find: jest.fn(),
              findOne: jest.fn(),
              findBy: jest.fn(),
            },
          },
        ],

      }).compile();

    service = module.get<ProductService>(ProductService);
    productRepo = module.get(getRepositoryToken(Product));
    categoryRepo = module.get(getRepositoryToken(Category));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {

    it('should create product', async () => {

      const dto = {
        title: 'Laptop',
        price: 2000,
        categoryIds: [1, 2],
      };

      const categories = [
        { id: 1, name: 'Tech' },
        { id: 2, name: 'Devices' },
      ];

      const createdProduct = {
        id: 1,
        title: dto.title,
        price: dto.price,
        categories,
      };

      categoryRepo.findBy.mockResolvedValue(categories as unknown as Category[]);

      productRepo.create.mockReturnValue(createdProduct as unknown as Product);

      productRepo.save.mockResolvedValue(createdProduct as unknown as Product);

      const result = await service.create(dto);

      expect(result).toEqual(createdProduct);

      expect(categoryRepo.findBy).toHaveBeenCalled();

      expect(productRepo.create,).toHaveBeenCalledWith({
        title: dto.title,
        price: dto.price,
        categories,
      });

      expect(productRepo.save).toHaveBeenCalled();
    });

    it('should create product with empty categories', async () => {

      const dto = {
        title: 'Laptop',
        price: 2000,
        categoryIds: [],
      };

      const createdProduct = {
        id: 1,
        ...dto,
        categories: [],
      };

      categoryRepo.findBy
        .mockResolvedValue([]);

      productRepo.create
        .mockReturnValue(
          createdProduct as unknown as Product,
        );

      productRepo.save
        .mockResolvedValue(
          createdProduct as unknown as Product,
        );

      const result =
        await service.create(dto);

      expect(result)
        .toEqual(createdProduct);
    });

    it('should throw if save fails', async () => {
      const dto = {
        title: 'Laptop',
        price: 2000,
        categoryIds: [],
      };

      categoryRepo.findBy.mockResolvedValue([]);

      productRepo.create.mockReturnValue(dto as unknown as Product);

      productRepo.save.mockRejectedValue(new Error('DB Error'));

      await expect(service.create(dto)).rejects.toThrow('DB Error');
    });
  });

  describe('findAll', () => {

    it('should return products with pagination', async () => {

      const products = [
        {
          id: 1,
          title: 'Laptop',
        },
      ];

      productRepo.findAndCount
        .mockResolvedValue([
          products as Product[],
          1,
        ]);

      const result =await service.findAll(0, 10);

      expect(result)
        .toEqual({
          items: products,
          total: 1,
          skip: 0,
          limit: 10,
        });

      expect(
        productRepo.findAndCount,
      ).toHaveBeenCalledWith({

        skip: 0,
        take: 10,
      });
    });

    it('should return empty list', async () => {

      productRepo.findAndCount
        .mockResolvedValue([
          [],
          0,
        ]);

      const result =
        await service.findAll(0, 10);

      expect(result)
        .toEqual({
          items: [],
          total: 0,
          skip: 0,
          limit: 10,
        });
    });

    it('should apply custom pagination', async () => {

      productRepo.findAndCount
        .mockResolvedValue([
          [],
          0,
        ]);

      await service.findAll(20, 5);

      expect(
        productRepo.findAndCount,
      ).toHaveBeenCalledWith({
        skip: 20,
        take: 5,
      });
    });
  });

  describe('findOne', () => {

    it('should return product', async () => {

      const product = {
        id: 1,
        title: 'Laptop',
      };

      productRepo.findOne
        .mockResolvedValue(
          product as Product,
        );

      const result =
        await service.findOne(1);

      expect(result)
        .toEqual(product);

      expect(
        productRepo.findOne,
      ).toHaveBeenCalledWith({

        where: { id: 1 },
        relations: ['categories'],
      });
    });

    it('should throw NotFoundException', async () => {

      productRepo.findOne
        .mockResolvedValue(null);

      await expect(
        service.findOne(999),
      ).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {

    it('should update product', async () => {

      const dto = {
        title: 'MacBook',
        price: 3000,
        categoryIds: [1],
      };

      const categories = [
        { id: 1, name: 'Tech' },
      ];

      const product = {
        id: 1,
        ...dto,
        categories,
      };

      productRepo.preload
        .mockResolvedValue(
          product as unknown as Product,
        );

      categoryRepo.findBy
        .mockResolvedValue(
          categories as unknown as Category[],
        );

      productRepo.save
        .mockResolvedValue(
          product as unknown as Product,
        );

      const result =
        await service.update(
          1,
          dto,
        );

      expect(result)
        .toEqual(product);

      expect(
        productRepo.preload,
      ).toHaveBeenCalledWith({
        id: 1,
        ...dto,
      });

      expect(
        categoryRepo.findBy,
      ).toHaveBeenCalled();

      expect(
        productRepo.save,
      ).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product not found', async () => {

      productRepo.preload.mockResolvedValue(undefined);

      await expect(

        service.update(
          999,
          {
            title: 'MacBook',
            price: 3000,
            categoryIds: [],
          },
        ),

      ).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update with empty categories', async () => {

      const dto = {
        title: 'MacBook',
        price: 3000,
        categoryIds: [],
      };

      const product = {
        id: 1,
        ...dto,
        categories: [],
      };

      productRepo.preload
        .mockResolvedValue(
          product as unknown as Product,
        );

      categoryRepo.findBy
        .mockResolvedValue([]);

      productRepo.save
        .mockResolvedValue(
          product as unknown as Product,
        );

      const result =
        await service.update(
          1,
          dto,
        );

      expect(result)
        .toEqual(product);
    });
  });

  describe('remove', () => {

    it('should remove product', async () => {
      const product = {
        id: 1,
        title: 'Laptop',
      };

      productRepo.findOne
        .mockResolvedValue(
          product as Product,
        );

      productRepo.remove
        .mockResolvedValue(
          product as Product,
        );

      const result =
        await service.remove(1);

      expect(result)
        .toEqual(product);

      expect(
        productRepo.remove,
      ).toHaveBeenCalledWith(
        product,
      );
    });

    it('should throw NotFoundException if product not found', async () => {

      productRepo.findOne
        .mockResolvedValue(null);

      await expect(
        service.remove(999),
      ).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});