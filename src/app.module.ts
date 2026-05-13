import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      load: [
        appConfig,
        databaseConfig,
      ],
    }),

    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: '127.0.0.1',
    //   port: 5432,
    //   username: 'postgres',
    //   password: '1234',
    //   database: 'shop',

    //   autoLoadEntities: true,
    //   // synchronize: true in DEVELOPMENT, synchronize: false in PRODUCTION
    //   synchronize: true,
    // }),

    TypeOrmModule.forRootAsync({

      inject: [ConfigService],

      useFactory: (
        config: ConfigService,
      ) => ({
        type: 'postgres',
        host: config.get<string>('database.host',),
        port: config.get<number>('database.port',),
        username: config.get<string>('database.username',),
        password: config.get<string>('database.password',),
        database: config.get<string>('database.name',),

        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),

    ProductModule,
    OrderModule,
    CategoryModule,
  ],
})
export class AppModule { }