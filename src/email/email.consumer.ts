import { Injectable } from '@nestjs/common';

import { OnEvent }
  from '@nestjs/event-emitter';

@Injectable()
export class EmailConsumer {

  @OnEvent('product.created')
  async handleProductCreated(
    payload: any,
  ) {

    console.log('SENDING EMAIL:',payload);
  }
}