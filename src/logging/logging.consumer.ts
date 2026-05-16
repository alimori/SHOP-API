import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingConsumer {

    constructor(
        private loggingService: LoggingService,
    ) { }

    @OnEvent('product.created')
    async handleProductCreated(payload: any) {

        await this.loggingService.createLog({
            event: 'product.created',
            entityId: payload.productId,
            entityType: 'Product',
            title: payload.title,
            message: `Product "${payload.title}" created`,
            metadata: payload,
        });

        console.log(`Product ${payload.title} is created. Log stored in MongoDB`);
    }

    @OnEvent('product.updated')
    async handleProductUpdated(payload: any,) {

        await this.loggingService.createLog({
            event: 'product.updated',
            entityId: payload.productId,
            entityType: 'Product',
            title: payload.newValues.title,
            message: `Product updated from "${payload.oldValues.title}" to "${payload.newValues.title}"`,
            metadata: payload,
        });

        console.log(`Product ${payload.title} is updated. Log stored in MongoDB`);
    }

    @OnEvent('product.deleted')
    async handleProductDeleted(
        payload: any,
    ) {
        await this.loggingService.createLog({
            event: 'product.deleted',
            entityId: payload.id,
            entityType: 'Product',
            title: payload.title,
            message: `Product "${payload.title}" deleted`,
            metadata: payload,
        });

        console.log(`Product ${payload.title} is deleted. Log stored in MongoDB`);
    }
}