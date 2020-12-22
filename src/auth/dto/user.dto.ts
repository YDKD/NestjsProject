import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({description: '姓名', example: 'zs'})
    readonly name: string
    @ApiProperty({description: '年龄', example: '18'})
    readonly age: number;
    @ApiProperty({description: '性别', example: '男'})
    readonly sex: string;
}
