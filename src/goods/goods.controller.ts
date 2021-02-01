import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { GoodsService } from './goods.service';

@Controller('goods')
@ApiTags('商品')
export class GoodsController {
    constructor(
        private readonly goodService: GoodsService
    ) { }
    @Get('/hot_iphone')
    async getHotIphoneData(@Query() query) {
        let res = await this.goodService.getHotIphoneData(query.currentPage, query.pageSize)
        let total: number = res[1]
        let result = res[0]
        return {
            result,
            total
        }
    }

    @Get('/screen')
    async screen(){
        this.goodService.getSendPlace()
    }
}
