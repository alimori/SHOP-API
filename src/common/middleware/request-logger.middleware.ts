import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import {
  NextFunction,
  Request,
  Response,
} from 'express';

@Injectable()
export class RequestLoggerMiddleware
  implements NestMiddleware
{

  use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {

    const {
      method,
      originalUrl,
      ip,
    } = request;

    const userAgent =
      request.get('user-agent') || '';

    const startTime = Date.now();

    response.on('finish', () => {

      const duration =
        Date.now() - startTime;

      console.log(

        `[${method}] ${originalUrl} ` +
        `${response.statusCode} - ` +
        `Response Time: ${duration}ms - ` +
        `${ip} - ${userAgent}`,
      );
    });

    next();
  }
}