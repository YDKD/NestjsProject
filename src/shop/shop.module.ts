import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { iphone } from 'src/entities/phone.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService]
})
export class ShopModule {}
