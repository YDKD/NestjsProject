/*
 * @Author: your name
 * @Date: 2021-01-04 11:56:12
 * @LastEditTime: 2021-01-15 14:58:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\auth\auth.module.ts
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { CommonService } from 'src/common/common.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { diskStorage } from 'multer';
import dayjs = require('dayjs');
import { TypeOrmModule } from '@nestjs/typeorm';
import { iphone } from 'src/entities/phone.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([iphone]),
    UserModule, 
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '2 days'
      }
    }),
    MulterModule.register({
      storage: diskStorage({
        //自定义路径
        destination: `./upload/${dayjs().format('YYYY-MM-DD')}`,
        filename: (req, file, cb) => {
          // 自定义文件名
          // const filename = `${nuid.next()}.${file.mimetype.split('/')[1]}`;
          // return cb(null, filename);
          return cb(null, file.originalname);
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, CommonService],
  exports: [AuthService]
})
export class AuthModule { }
