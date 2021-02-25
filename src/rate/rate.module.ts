import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UserModule
  ],
  controllers: [RateController],
  providers: [RateService]
})
export class RateModule {}
