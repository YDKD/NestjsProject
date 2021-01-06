/*
 * @Author: your name
 * @Date: 2020-12-29 12:07:14
 * @LastEditTime: 2021-01-06 14:42:47
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\interceptor\transform.interceptor.ts
 */
import {
    Injectable,
    NestInterceptor,
    CallHandler,
    ExecutionContext,
  } from '@nestjs/common';
  import { map } from 'rxjs/operators';
  import { Observable } from 'rxjs';
  interface Response<T> {
    data: T;
  }
  @Injectable()
  export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
      context: ExecutionContext,
      next: CallHandler<T>,
    ): Observable<Response<T>> {
      return next.handle().pipe(
        map(data => {
          return {
            data,
            code: 1,
            message: '请求成功',
          };
        }),
      );
    }
  }
  