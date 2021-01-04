import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { encryptPassword } from 'src/utils/cryptogram';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService
    ) { }

    encrypt(password: string) {
        return encryptPassword(password, 'dasd')
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne(username);
        console.log(user)
        const salt = user.passwd_salt
        const hashPassword = encryptPassword(password, salt)
        if (user && user.password == hashPassword) {
            return user
        } else {
            return null
        }
    }
}
