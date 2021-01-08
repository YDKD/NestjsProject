/*
 * @Author: your name
 * @Date: 2021-01-04 11:46:53
 * @LastEditTime: 2021-01-08 16:31:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\user\user.controller.ts
 */
import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { UserEntity } from 'src/entities/user.entity';
import { emailDto } from './dto/email.dto';

import { findOne } from './dto/find.dto';
import { registerUserDto } from './dto/register.dto';
import { usernamDto } from './dto/username.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('用户')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('/user_id')
    @ApiBearerAuth()
    @ApiOperation({ summary: '查询用户信息' })
    async findOneByUserId(@Query() query: findOne) {
        return await this.userService.findOneByUserId(query.id)
    }


    @Post('/create')
    @ApiOperation({ summary: '创建用户' })
    async createUser(@Body() body: registerUserDto) {
        let result = await this.userService.createUser(body.username, body.password, body.email, body.verifyCode)
        if (result.affectedRows > 0) {
            return {
                status: 200,
                msg: '创建成功'
            }
        } else {
            return {
                status: 201,
                msg: '创建失败'
            }
        }
    }

    @Get('/user_exist/:username')
    @ApiOperation({ summary: '验证用户名是否已被注册' })
    async usernameExist(@Param() params: usernamDto) {
        const result = await this.userService.usernameExist(params.username)
        if (result) {
            return {
                status: 201,
                msg: '该用户名已被注册'
            }
        } else {
            return {
                status: 200
            }
        }
    }

    @Get('/email/exist/:email')
    @ApiOperation({ summary: '验证用户名是否已被注册' })
    async emailExist(@Param() params: emailDto) {
        const result = await this.userService.emailExist(params.email)
        if (result) {
            return {
                status: 201,
                msg: '该邮箱已被注册'
            }
        } else {
            return {
                status: 200
            }
        }
    }

    @Post('/email/code')
    @HttpCode(200)
    async emailValidate(@Body() body: emailDto) {
        let res = await this.userService.sendEmail(body.email)
        if (res === 200) {
            return {
                status: 200,
                msg: '验证码发送成功'
            }
        } else {
            return {
                status: 201,
                msg: '验证码发送成功'
            }
        }
    }
}
