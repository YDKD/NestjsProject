import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RateService } from './rate.service';

@Controller('rate')
@ApiTags('价格分布')
export class RateController {
    constructor(
        private readonly rateService: RateService
    ) { }

    @Get('/price')
    @HttpCode(200)
    @ApiOperation({summary: '获取价格分布区间'})
    async comparePriceSection(@Query() query) {
        return await this.rateService.comparePriceSection(query.section, query.user_id)
    }

}
