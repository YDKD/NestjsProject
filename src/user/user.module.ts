/*
 * @Author: your name
 * @Date: 2021-01-04 11:46:45
 * @LastEditTime: 2021-01-05 17:12:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\user\user.module.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailerModule } from '@nestjs-modules/mailer'
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),
  MailerModule.forRoot({
    transport: {
      host: "smtp.qq.com", //qq smtp服务器地址
      secureConnection: false, //是否使用安全连接，对https协议的
      port: 465, //qq邮件服务所占用的端口
      auth: {
        user: "1606354057@qq.com",//开启SMTP的邮箱，有用发送邮件
        pass: "fjqijfexnlpmgabf"//授权码
      }
    },
    defaults: {
      from: '"Foss-store" <1606354057@qq.com>'
    }
  })],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
