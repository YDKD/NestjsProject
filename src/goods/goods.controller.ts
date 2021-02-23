import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { GoodsService } from './goods.service';

@Controller('goods')
@ApiTags('商品')
export class GoodsController {
    constructor(
        private readonly goodService: GoodsService
    ) { }
    @Get('/hot_iphone')
    @HttpCode(200)
    @ApiOperation({summary: '获取热销数据'})
    async getHotIphoneData(@Query() query) {
        let { total, result } = await this.goodService.getHotIphoneData(query.currentPage, query.pageSize, query.user_id)
        return {
            result,
            total
        }
    }

    @Get('/shortest')
    @HttpCode(200)
    @ApiOperation({summary: '筛选用户最短距离数据'})
    async screen(@Query() query) {
        return await this.goodService.getSendPlace(query.user_place)
    }


    @Post('/export_hot')
    @HttpCode(200)
    @ApiOperation({summary: '导出数据'})
    async exporHotData(@Body() body) {
        return await this.goodService.exportData(body.data, body.check)
    }
}
