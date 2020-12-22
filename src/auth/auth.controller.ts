
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service'
import { User } from 'src/entities/user.entity';
import { UserDto } from './dto/user.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
// import { PythonShell } from 'python-shell';
var jsexecpy = require("jsexecpy")


@Controller('auth')
@ApiTags('用户信息')
@Crud({
    model: {
        type: User,
    },
    // dto
    dto: {
        create: UserDto,
        update: UserDto,
        replace: UserDto
    },
    routes: {
        exclude: ['getManyBase', 'createManyBase', 'replaceOneBase'],
        getOneBase: {
            decorators: [ApiOperation({ summary: '查询用户' }), ],
            interceptors: ['11111']
        },
        createOneBase: {
            decorators: [ApiOperation({ summary: '创建用户' })]
        },
        updateOneBase: {
            decorators: [ApiOperation({ summary: '更新用户' })],
            returnShallow: true
        },
        deleteOneBase: {
            decorators: [ApiOperation({ summary: '删除用户' })]
        },
        // replaceOneBase: {
        //     decorators: [ApiOperation({ summary: '修改用户' })]
        // },
    },
    query: {

    }
})
// @CrudAuth({
//     property: 'user',
//     filter: (user: User) => ({
//         id: user.id,
//         isActive: true,
//     })
// })
export class AuthController implements CrudController<User>{
    constructor(public service: AuthService,
        private jwtService: JwtService,
        private authService: AuthService,
    ) {

    }


    @Get('diy/:id')
    findOne(@Param('id') id: number): Promise<User[]> {
        return this.authService.getUser(id);
    }

    @Get('python')
    startPython() {
        let params = [1, 2, 3]
        jsexecpy.runpath_with_params("C:/Users/12996/Desktop/dk-api/Nodejs-Nestjs--/server/apps/admin/src/auth/test.py", params, async ({ data, pythonpath }) => {
            return await data
        })

    }

    @Post('diy/user')
    insertUser(@Body() userData: UserDto) {
        return this.authService.redirect(userData)
    }
}
