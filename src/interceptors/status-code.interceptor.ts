import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class StatusCodeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && data.hasOwnProperty('status')) {
          const response = context.switchToHttp().getResponse();
          response.status(data.status);
        }

        return data;
      }),
    );
  }
}
