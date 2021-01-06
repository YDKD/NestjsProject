/*
 * @Author: your name
 * @Date: 2021-01-06 12:37:57
 * @LastEditTime: 2021-01-06 12:38:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\user\dto\email.dto.ts
 */

import { ApiProperty } from "@nestjs/swagger";

export class emailDto {
    @ApiProperty()
    email: string
}
