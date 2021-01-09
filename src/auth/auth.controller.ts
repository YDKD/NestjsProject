/*
 * @Author: YDKD
 * @Date: 2021-01-04 11:56:20
 * @LastEditTime: 2021-01-09 13:51:26
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
    async login(@Body() body:LoginDto) {
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
}
