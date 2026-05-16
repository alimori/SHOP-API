import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { OutboxEvent } from './entities/outbox-event.entity';
import { OutboxProcessor } from './outbox.processor';

@Module({
    imports: [
        ScheduleModule.forRoot(),

        TypeOrmModule.forFeature([
            OutboxEvent,
        ]),
    ],

    providers: [
        OutboxProcessor,
    ],

    exports: [
        TypeOrmModule,
    ],
})
export class OutboxModule { }