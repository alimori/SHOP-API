import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OutboxModule } from './outbox/outbox.module';
import { LoggingModule } from './logging/logging.module';
import { EmailModule } from './email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { UploadModule } from './upload/upload.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      load: [
        appConfig,
        databaseConfig,
      ],
    }),


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

    // MongoDb
    MongooseModule.forRoot(
      'mongodb://localhost:27017/shop-logs',
    ),

    KafkaModule,
    RabbitMQModule,
    UploadModule,
    ProductModule,
    OrderModule,
    CategoryModule,
    CommonModule,
    EventEmitterModule.forRoot(),
    OutboxModule,
    LoggingModule,
    EmailModule,
  ],
})
export class AppModule { }