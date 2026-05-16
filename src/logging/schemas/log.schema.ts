import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

@Schema({
    timestamps: true,
})
export class Log {

    @Prop()
    event: string;

    @Prop()
    message: string;

    @Prop()
    entityId: number;

    @Prop()
    entityType: string;

    @Prop()
    title: string;

    @Prop({
        type: Object,
    })
    metadata: any;
}

export const LogSchema =
    SchemaFactory.createForClass(Log);