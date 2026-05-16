import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './schemas/log.schema';
import { LoggingConsumer } from './logging.consumer';
import { LoggingService } from './logging.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Log.name,
                schema: LogSchema,
            },
        ]),
    ],

    providers: [
        LoggingConsumer,
        LoggingService,
    ],
})
export class LoggingModule { }