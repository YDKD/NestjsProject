import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { iphone } from 'src/entities/phone.entity';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([iphone]),
    MailerModule.forRoot({
      transport: {
        host: "smtp.qq.com", //qq smtp服务器地址
        secureConnection: false, //是否使用安全连接，对https协议的
        port: 465, //qq邮件服务所占用的端口
        auth: {
          user: "1606354057@qq.com",//开启SMTP的邮箱，有用发送邮件
          pass: "fjqijfexnlpmgabf"//授权码
        }
      }
    })
  ],
  controllers: [SystemController],
  providers: [SystemService]
})
export class SystemModule {}
