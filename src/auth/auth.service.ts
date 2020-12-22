import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from 'src/entities/user.entity';


@Injectable()
export class AuthService extends TypeOrmCrudService<User>{
    constructor(@InjectRepository(User) repo) {
        super(repo)
    }

    async getUser(id: number): Promise<User[]> {
        return await this.repo.find({ id })
    }

    async redirect(data) {
        let result = await this.repo.insert(data)
        if (result.raw.affectedRows == 1) {
            return '添加成功'
        } else {
            throw new BadRequestException('添加失败')
        }
    }
}
