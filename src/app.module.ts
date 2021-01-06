import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InitMiddleware } from './middleware/init.middleware';
// import { UserModule } from './user1/user.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InitMiddleware)
      .exclude('auth/(.*)')
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
