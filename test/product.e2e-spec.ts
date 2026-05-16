import {INestApplication} from '@nestjs/common';
import {Test,TestingModule} from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from './../src/app.module';

describe('Product E2E', () => {

  let app: INestApplication;

  beforeEach(async () => {

    const moduleFixture:
      TestingModule =
      await Test.createTestingModule({

        imports: [AppModule],

      }).compile();

    app =
      moduleFixture
        .createNestApplication();

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /products', () => {

    it('should return products', async () => {

      const response =await request(app.getHttpServer())
          .get('/products')
          .expect(200);

      expect(response.body)
        .toBeDefined();
    });
  });

  describe('GET /products/:id', () => {

    it('should return 404 for invalid id', async () => {

      await request(app.getHttpServer())
        .get('/products/999999')
        .expect(404);
    });

    it('should return 400 for invalid param', async () => {

      await request(app.getHttpServer())
        .get('/products/abc')
        .expect(400);
    });
  });
});