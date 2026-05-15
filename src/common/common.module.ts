import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';

import { ApiKeyGuard } from './guards/api-key/api-key.guard';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { WrapResponseInterceptor } from './interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';

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
export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer,) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
        // consumer.apply(RequestLoggerMiddleware).exclude('products','categories').forRoutes('*');
        // consumer.apply(RequestLoggerMiddleware).forRoutes('products');
        // consumer.apply(RequestLoggerMiddleware).forRoutes({ path: 'products', method: RequestMethod.GET });
    }
}