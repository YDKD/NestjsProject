/*
 * @Author: YDKD
 * @Date: 2021-01-04 11:56:20
 * @LastEditTime: 2021-01-18 11:54:46
 * @LastEditors: Please set LastEditors
 * @Description: Auth Controller
 * @FilePath: \NestjsProject\src\auth\auth.controller.ts
 */
import { BadRequestException, Body, Controller, Get, Param, Post, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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

    @Post('/upload')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 }
    ]))
    async upload(@UploadedFiles() files) {
        if (JSON.stringify(files) == '{}') {
            return {
                code: 201,
                msg: '上传文件为空'
            }
        } else {
            let res = await this.authService.uploadFile(files['file'][0])
            if(res == 200) {
                return {
                    code: 200,
                    msg: '上传成功'
                }
            } else {
                return {
                    code: 201,
                    msg: res
                }
            }
            console.log(res)
        }

    }
}
