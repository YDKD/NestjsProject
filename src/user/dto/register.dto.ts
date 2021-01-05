/*
 * @Author: your name
 * @Date: 2021-01-05 14:24:46
 * @LastEditTime: 2021-01-05 16:41:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\user\dto\register.dto.ts
 */

import { ApiProperty } from "@nestjs/swagger";

 export class registerUserDto {
     @ApiProperty()
     username: string
     @ApiProperty()
     password: string
     @ApiProperty()
     email: string
     @ApiProperty()
     verifyCode: number
 }
