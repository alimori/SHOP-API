import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // const request = context
    //   .switchToHttp()
    //   .getRequest<Request>();

    // const authHeader = request.headers.authorization;

    // if (!authHeader) {
    //   throw new UnauthorizedException(
    //     'Authorization header missing',
    //   );
    // }

    // const token = authHeader.replace('Bearer ', '');

    // if (token !== process.env.API_KEY) {
    //   throw new UnauthorizedException(
    //     'Invalid API key',
    //   );
    // }

    return true;
  }
}