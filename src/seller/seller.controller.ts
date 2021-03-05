import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShopService } from 'src/shop/shop.service';
import { SellerService } from './seller.service';

@Controller('seller')
@ApiTags('卖家管理')
export class SellerController {
    constructor(
        private readonly sellerService: SellerService,
    ) { }
      
    @Get('/province/:id')
    @ApiOperation({summary: '获取省份数据'})
    async getProvinceData(@Param('id') id) {
        return await this.sellerService.getProvinceData(id)
    }

    @Get('/city/:id')
    @ApiOperation({summary: '获取城市数据信息'})
    async getCityData(@Param('id') id) {
        return await this.sellerService.getCityData(id)
    }
}
