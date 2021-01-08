/*
 * @Author: your name
 * @Date: 2020-12-29 12:07:14
 * @LastEditTime: 2021-01-08 16:33:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\app.module.ts
 */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InitMiddleware } from './middleware/init.middleware';
// import { UserModule } from './user1/user.module';
import { UserModule } from './user/user.module';
import { RedisModule } from 'nestjs-redis'
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    RedisModule.register({
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0
    }),
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InitMiddleware)
      .exclude({ path: 'auth/(.*)', method: RequestMethod.ALL },
        { path: 'user/user_exist/(.*)', method: RequestMethod.ALL },
        { path: 'user/create', method: RequestMethod.POST },
        { path: 'user/email/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
