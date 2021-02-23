import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShopService } from 'src/shop/shop.service';
import { SellerService } from './seller.service';

@Controller('seller')
@ApiTags('卖家管理')
export class SellerController {
    constructor(
        private readonly sellerService: SellerService,
    ) { }
      
    @Get('/province/:id')
    async getProvinceData(@Param('id') id) {
        return await this.sellerService.getProvinceData(id)
    }
}
