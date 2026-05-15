import { Global, Module } from '@nestjs/common';

import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';

import { ApiKeyGuard } from './guards/api-key/api-key.guard';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Global()
@Module({
  imports: [
    ConfigModule,
  ],

  providers: [

    // Global API Key Guard
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },

    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],

  exports: [],
})
export class CommonModule {}