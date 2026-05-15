import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WrapResponseInterceptor<T> implements NestInterceptor<T> {

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {

        const response = context
            .switchToHttp()
            .getResponse();

        return next.handle().pipe(

            map((data) => ({

                success: true,

                statusCode: response.statusCode,

                timestamp: new Date().toISOString(),

                data,
            })),
        );
    }
}