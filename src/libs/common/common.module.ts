import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CommonService } from './common.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.registerAsync({
      useFactory(){
        return {
          secret: process.env.SECRET
        }
      }
    })
  ],
  providers: [CommonService],
  exports: [JwtModule, CommonService]
})
export class CommonModule {}
