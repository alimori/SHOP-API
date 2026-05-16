import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OutboxEvent } from './entities/outbox-event.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OutboxProcessor {

    constructor(

        @Inject('RABBITMQ_SERVICE')
        private rabbitClient: ClientProxy,

        @InjectRepository(OutboxEvent)
        private outboxRepo: Repository<OutboxEvent>,

        private eventEmitter: EventEmitter2,
    ) { }

    // Means every 5 seconds
    @Cron('*/5 * * * * *')
    async process() {

        const events = await this.outboxRepo.find({
            where: {
                processed: false,
            },
        });

        // for (const event of events) {

        //     // Add event to internal nest events and Postgresql
        //     this.eventEmitter.emit(event.type, JSON.parse(event.payload));


        //     // Add event to RabbitMQ
        //     await this.rabbitClient.emit(event.type, JSON.parse(event.payload));

        //     event.processed = true;
        //     await this.outboxRepo.save(event);

        //     console.log(`Processed event: ${event.type}`);
        // }

        for (const event of events) {
            try {
                // Add event to RabbitMQ
                await this.rabbitClient.emit(event.type, JSON.parse(event.payload));

                // Add event to internal nest events and Postgresql
                this.eventEmitter.emit(event.type, JSON.parse(event.payload),);

                event.processed = true;

                await this.outboxRepo.save(event);

                console.log(`Processed: ${event.type}`,);

            } catch (error) {
                console.error(`Failed event: ${event.type}`,error);
            }
        }

    }
}