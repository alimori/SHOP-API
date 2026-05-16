import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Log, LogDocument } from './schemas/log.schema';

@Injectable()
export class LoggingService {

    constructor(
        @InjectModel(Log.name)
        private logModel: Model<LogDocument>,
    ) { }

    async createLog(
        data: Partial<Log>,
    ) {

        return this.logModel.create(data);
    }
}