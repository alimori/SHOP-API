import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'shop',

      autoLoadEntities: true,
      // synchronize: true in DEVELOPMENT, synchronize: false in PRODUCTION
      synchronize: true,
    }),
    ProductModule,
    OrderModule,
  ],
})
export class AppModule { }