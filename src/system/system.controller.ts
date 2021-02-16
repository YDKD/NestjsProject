import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemService } from './system.service';

@Controller('system')
@ApiTags('系统管理')
export class SystemController {
    constructor(
        private readonly systemService: SystemService
    ){}

    @HttpCode(200)
    @Get('/category')
    @ApiOperation({summary: '获取默认分类数据'})
    async getCategory(@Query() query){
        return await this.systemService.getDeafultData(query.category)
    }

    @HttpCode(200)
    @Post('/category')
    @ApiOperation({summary: '保存用户配置信息'})
    async saveConfigCategory(@Body() body:any) {
       return await this.systemService.saveConfigCategory(body.data, body.user_id)
    }

    @HttpCode(200)
    @Post('/configure/custom')
    @ApiOperation({summary: '用户传递的自定义筛选规则'})
    async cofigureCustom(@Body() body) {
        return await this.systemService.configureCustom(body.data, body.user_id)
    }
}
