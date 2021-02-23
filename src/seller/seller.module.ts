import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { iphone } from 'src/entities/phone.entity';
import { ShopModule } from 'src/shop/shop.module';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([iphone]),
        ShopModule
    ],
    controllers: [SellerController],
    providers: [SellerService]
})
export class SellerModule { }
