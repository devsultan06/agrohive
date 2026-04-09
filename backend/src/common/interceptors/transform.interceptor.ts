import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const response = context.switchToHttp().getResponse();
    const status = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: data?.data || data, // Handle cases where data is already nested or direct
        message: data?.message || 'Operation successful',
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
        status: status,
      })),
    );
  }
}
