import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShopService } from './shop.service';

@Controller('shop')
@ApiTags('店铺')
export class ShopController {
    constructor(
        private readonly shopService: ShopService
    ) { }
    
    @Get('/user_data')
    @HttpCode(200)
    @ApiOperation({summary:'获取店铺默认数据'})
    async getHotShopData(@Query() query){
        return await this.shopService.getHotShopData(query.user_id, query.currentPage, query.pageSize)
    }

    @Post('/screen_data')
    @HttpCode(200)
    @ApiOperation({summary:'筛选店铺数据'})
    async screenData(@Body() body) {
        return await this.shopService.screenData(body)
    }
}
