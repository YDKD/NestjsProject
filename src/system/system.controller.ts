import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
    async getCategory(@Query() query){
        return await this.systemService.getDeafultData(query.category)
    }

    @HttpCode(200)
    @Post('/category')
    async saveConfigCategory(@Body() body:any) {
       return await this.systemService.saveConfigCategory(body.data, body.user_id)
    }

    @HttpCode(200)
    @Post('/configure/custom')
    async cofigureCustom(@Body() body) {
        return await this.systemService.configureCustom(body.data, body.user_id)
    }
}
