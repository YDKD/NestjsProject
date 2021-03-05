/*
 * @Author: YDKD
 * @Date: 2021-01-04 11:56:20
 * @LastEditTime: 2021-01-18 11:54:46
 * @LastEditors: Please set LastEditors
 * @Description: Auth Controller
 * @FilePath: \NestjsProject\src\auth\auth.controller.ts
 */
import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
var jsexecpy = require("jsexecpy")
var path = require('path')
@Controller('auth')
@ApiTags('验权')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService
    ) {

    }
    // 登录
    @UseGuards(AuthGuard('local'))
    @Post('/login')
    @HttpCode(200)
    @ApiOperation({ summary: '登录' })
    async login(@Body() body: LoginDto) {
        return await this.authService.login(body.username, body.password)

    }

    // 加密密码
    @UseGuards(AuthGuard('jwt'))
    @Get('/encrypt/:password')
    @ApiBearerAuth()
    @ApiOperation({ summary: '加密密码' })
    async encrypt(@Param('password') password) {
        return await this.authService.encrypt(password)
    }

    @Post('/decrypt')
    async decryptData(@Body() body) {
        this.authService.decrypt(body.data)
    }


    @Post('/encrypt')
    async encryptData(@Body() body) {
        return await this.authService.encryptData(body.data, true)
    }

    @Get('/logout/:username')
    @ApiOperation({ summary: '退出登录' })
    async logout(@Param('username') username) {
        await this.authService.logout(username)
    }

    @Get('python')
    startPython() {
        let params = ['mac', 'mac']
        let str = path.join(__dirname, '/test.py')
        jsexecpy.runpath_with_params('C:/Users/12996/Desktop/FossStoreApi/project/NestjsProject/src/auth/main.py', params, async ({ data, pythonpath }) => {
            return await data
        })

    }

    @Post('/upload')
    @HttpCode(200)
    @ApiOperation({ summary: '上传文件' })
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 }
    ]))
    async upload(@UploadedFiles() files, @Body() body) {
        if (JSON.stringify(files) == '{}') {
            return {
                code: 201,
                msg: '上传文件为空'
            }
        } else {
            let res = await this.authService.uploadFile(
                files['file'][0],
                body['note_user_id'],
                body['category'],
                body['upload_user_name'],
                body['brand'],
                body['product']
            )
            return res
        }

    }


    @Get('/user_router_list/:username')
    @ApiOperation({ summary: '根据用户名获取用户的路由列表' })
    async getUserRouterList(@Param('username') username) {
        return await this.authService.userRouterList(username)
    }

    @Get('/map')
    @ApiOperation({ summary: '获取用户登录地址可视化' })
    async getMap() {
        return await this.authService.userMap()
    }

    @Get('/tables/:id')
    @ApiOperation({summary: '管理员下获取数据库的表'})
    async getTables(@Param('id') id) {
        return await this.authService.getTables(id)
    }

    @Get('/upload/status')
    @ApiOperation({summary: '获取上传文件的状态'})
    async getUploadStatus() {
        return await this.authService.getUploadTables()
    }
}
