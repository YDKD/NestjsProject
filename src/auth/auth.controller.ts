import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
        return await this.authService.login(body.username, body.password)

    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/encrypt/:password')
    @ApiBearerAuth()
    async encrypt(@Param('password') password) {
        return this.authService.encrypt(password)
    }
}
