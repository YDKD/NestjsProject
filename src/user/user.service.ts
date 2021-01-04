import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }


  /**
   * @param username
   * 
  */
  async findOne(username: string) {
    const result = await this.userRepository.query(`SELECT * FROM user_entity WHERE username = '${username}'`)
    const user = JSON.parse(JSON.stringify(result))
    if (user) return user[0];
    else return null
  }

}
