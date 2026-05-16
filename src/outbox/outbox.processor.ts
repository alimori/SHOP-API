import {Injectable} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OutboxEvent } from './entities/outbox-event.entity';

@Injectable()
export class OutboxProcessor {

  constructor(
    @InjectRepository(OutboxEvent)
    private outboxRepo:Repository<OutboxEvent>,

    private eventEmitter:EventEmitter2,
  ) {}

  // Means every 5 seconds
  @Cron('*/5 * * * * *')
  async process() {

    const events =
      await this.outboxRepo.find({
        where: {
          processed: false,
        },
      });

    for (const event of events) {

      this.eventEmitter.emit(
        event.type,
        JSON.parse(event.payload),
      );

      event.processed = true;

      await this.outboxRepo.save(event);

      console.log(
        `Processed event: ${event.type}`,
      );
    }
  }
}