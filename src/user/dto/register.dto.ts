/*
 * @Author: your name
 * @Date: 2021-01-05 14:24:46
 * @LastEditTime: 2021-01-09 11:57:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\user\dto\register.dto.ts
 */

import { ApiProperty } from "@nestjs/swagger";

 export class registerUserDto {
     @ApiProperty()
     data: string
 }
