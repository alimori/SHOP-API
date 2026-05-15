import { Global, Module } from '@nestjs/common';

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';

import { ApiKeyGuard } from './guards/api-key/api-key.guard';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { WrapResponseInterceptor } from './interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';

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

        // Global Interceptor
        {
            provide: APP_INTERCEPTOR,
            useClass: TimeoutInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: WrapResponseInterceptor,
        },


    ],

    exports: [],
})
export class CommonModule { }