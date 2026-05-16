import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { OutboxEvent } from './entities/outbox-event.entity';
import { OutboxProcessor } from './outbox.processor';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),

        TypeOrmModule.forFeature([
            OutboxEvent,
        ]),

        RabbitMQModule 
    ],

    providers: [
        OutboxProcessor,
    ],

    exports: [
        TypeOrmModule,
    ],
})
export class OutboxModule { }