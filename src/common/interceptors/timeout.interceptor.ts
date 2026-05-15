import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { Observable, throwError } from 'rxjs';

import {
  catchError,
  timeout,
} from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor
  implements NestInterceptor
{

  constructor(
    private readonly configService: ConfigService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {

    const timeoutMs = Number(

      this.configService.get<string>(
        'REQUEST_TIMEOUT',
        '10000',
      ),
    );

    return next.handle().pipe(

      timeout(timeoutMs),

      catchError((error) => {

        if (error.name === 'TimeoutError') {

          return throwError(() =>

            new RequestTimeoutException(
              `Request timeout after ${timeoutMs}ms`,
            ),
          );
        }

        return throwError(() => error);
      }),
    );
  }
}