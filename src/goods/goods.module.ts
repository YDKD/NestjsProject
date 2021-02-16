import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { iphone } from 'src/entities/phone.entity';
import { UserModule } from 'src/user/user.module';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([iphone]),
    UserModule
  ],
  controllers: [GoodsController],
  providers: [GoodsService]
})
export class GoodsModule {}
