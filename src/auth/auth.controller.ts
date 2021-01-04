import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';


@Controller('auth')
@ApiTags('用户信息')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {

    }
    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Body() body) {
        let result = await this.authService.validateUser(body.username, body.password)
        if (result) {
            return '登录成功'
        } else {
            throw new BadRequestException('登录失败')
        }
    }

    @Post('/encrypt')
    async encrypt(@Body() body) {
        return this.authService.encrypt(body.password)
    }
}
