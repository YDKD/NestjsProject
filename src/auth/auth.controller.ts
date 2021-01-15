/*
 * @Author: YDKD
 * @Date: 2021-01-04 11:56:20
 * @LastEditTime: 2021-01-12 14:56:34
 * @LastEditors: Please set LastEditors
 * @Description: Auth Controller
 * @FilePath: \NestjsProject\src\auth\auth.controller.ts
 */
import { BadRequestException, Body, Controller, Get, Param, Post, UseFilters, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
    async login(@Body() body: LoginDto) {
        return await this.authService.login(body.username, body.password)

    }

    // 加密密码
    @UseGuards(AuthGuard('jwt'))
    @Get('/encrypt/:password')
    @ApiBearerAuth()
    async encrypt(@Param('password') password) {
        return await this.authService.encrypt(password)
    }

    @Post('/decrypt')
    async decryptData(@Body() body) {
        this.authService.decrypt(body.data)
    }


    @Post('/encrypt')
    async encryptData(@Body() body) {
        return await this.authService.encryptData(body.data)
    }

    @Get('/logout/:username')
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
}
