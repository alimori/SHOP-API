import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  NotFoundException,
} from '@nestjs/common';

import { ProductController }
from './product.controller';

import { ProductService }
from './product.service';

describe('ProductController', () => {

  let controller: ProductController;

  let productService:
    jest.Mocked<ProductService>;

  beforeEach(async () => {

    const mockProductService = {

      create: jest.fn(),

      findAll: jest.fn(),

      findOne: jest.fn(),

      update: jest.fn(),

      remove: jest.fn(),
    };

    const module: TestingModule =
      await Test.createTestingModule({

        controllers: [
          ProductController,
        ],

        providers: [

          {
            provide: ProductService,

            useValue:
              mockProductService,
          },
        ],

      }).compile();

    controller =
      module.get<ProductController>(
        ProductController,
      );

    productService =
      module.get(ProductService);
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

      const createdProduct = {

        id: 1,

        ...dto,
      };

      productService.create
        .mockResolvedValue(
          createdProduct as any,
        );

      const result =
        await controller.create(dto);

      expect(result)
        .toEqual(createdProduct);

      expect(
        productService.create,
      ).toHaveBeenCalledWith(dto);

      expect(
        productService.create,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw error if service fails', async () => {

      const dto = {

        title: 'Laptop',

        price: 2000,

        categoryIds: [],
      };

      productService.create
        .mockRejectedValue(
          new Error('DB Error'),
        );

      await expect(
        controller.create(dto),
      ).rejects.toThrow(
        'DB Error',
      );
    });
  });

  describe('findAll', () => {

    it('should return paginated products', async () => {

      const response = {

        items: [

          {
            id: 1,
            title: 'Laptop',
          },
        ],

        total: 1,

        skip: 0,

        limit: 10,
      };

      productService.findAll
        .mockResolvedValue(
          response as any,
        );

      const query = {

        skip: 0,

        limit: 10,
      };

      const result =
        await controller.findAll(
          query,
        );

      expect(result)
        .toEqual(response);

      expect(
        productService.findAll,
      ).toHaveBeenCalledWith(
        0,
        10,
      );
    });

    it('should return empty product list', async () => {

      const response = {

        items: [],

        total: 0,

        skip: 0,

        limit: 10,
      };

      productService.findAll
        .mockResolvedValue(
          response as any,
        );

      const result =
        await controller.findAll({

          skip: 0,

          limit: 10,
        });

      expect(result.items)
        .toEqual([]);

      expect(result.total)
        .toBe(0);
    });

    it('should apply custom pagination', async () => {

      productService.findAll
        .mockResolvedValue(
          {
            items: [],
            total: 0,
            skip: 20,
            limit: 5,
          } as any,
        );

      await controller.findAll({

        skip: 20,

        limit: 5,
      });

      expect(
        productService.findAll,
      ).toHaveBeenCalledWith(
        20,
        5,
      );
    });
  });

  describe('findOne', () => {

    it('should return product by id', async () => {

      const product = {

        id: 1,

        title: 'Laptop',
      };

      productService.findOne
        .mockResolvedValue(
          product as any,
        );

      const result =
        await controller.findOne(1);

      expect(result)
        .toEqual(product);

      expect(
        productService.findOne,
      ).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException', async () => {

      productService.findOne
        .mockRejectedValue(

          new NotFoundException(
            'Product not found',
          ),
        );

      await expect(
        controller.findOne(999),
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

      const updatedProduct = {

        id: 1,

        ...dto,
      };

      productService.update
        .mockResolvedValue(
          updatedProduct as any,
        );

      const result =
        await controller.update(
          1,
          dto,
        );

      expect(result)
        .toEqual(updatedProduct);

      expect(
        productService.update,
      ).toHaveBeenCalledWith(
        1,
        dto,
      );
    });

    it('should throw NotFoundException if product not found', async () => {

      const dto = {

        title: 'MacBook',

        price: 3000,

        categoryIds: [],
      };

      productService.update
        .mockRejectedValue(

          new NotFoundException(
            'Product not found',
          ),
        );

      await expect(

        controller.update(
          999,
          dto,
        ),

      ).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {

    it('should remove product', async () => {

      const removedProduct = {

        id: 1,

        title: 'Laptop',
      };

      productService.remove
        .mockResolvedValue(
          removedProduct as any,
        );

      const result =
        await controller.remove(1);

      expect(result)
        .toEqual(removedProduct);

      expect(
        productService.remove,
      ).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if product not found', async () => {

      productService.remove
        .mockRejectedValue(

          new NotFoundException(
            'Product not found',
          ),
        );

      await expect(
        controller.remove(999),
      ).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});