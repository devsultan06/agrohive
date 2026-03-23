import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error('🔥 Exception caught by AllExceptionsFilter:', exception);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message || exception.message
        : 'Internal server error';

    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      message: Array.isArray(message) ? message.join(', ') : message,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
      requestId: (request as any).id || undefined, // Useful if you use a request-id middleware
      status: status,
    };

    response.status(status).json(errorResponse);
  }
}
