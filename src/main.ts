/*
 * @Author: your name
 * @Date: 2020-12-29 12:07:14
 * @LastEditTime: 2021-01-06 14:59:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\main.ts
 */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { InitMiddleware } from './middleware/init.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(InitMiddleware)
  // 允许跨域
  app.enableCors()
  // 静态文件托管
  // 错误返回
  app.useGlobalFilters(new HttpExceptionFilter())
  // 成功返回
  app.useGlobalInterceptors(new TransformInterceptor());
  // Swagger配置
  const options = new DocumentBuilder()
    .setTitle('YDKD Api')
    .setDescription('The Nestjs Api Design By YDKD')
    .setVersion('1.0')
    .addBearerAuth() // 给 swagger 加一个 token 才能访问接口
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3009);
  console.log(`http://localhost:3009/api-docs`)
}
bootstrap();
