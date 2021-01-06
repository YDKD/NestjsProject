import { ApiProperty } from "@nestjs/swagger";

/*
 * @Author: your name
 * @Date: 2021-01-06 12:28:52
 * @LastEditTime: 2021-01-06 12:30:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\user\dto\username.dto.ts
 */
export class usernamDto {
    @ApiProperty()
    username: string
}
