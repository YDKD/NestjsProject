import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { encryptPassword } from 'src/utils/cryptogram';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    encrypt(password: string) {
        return encryptPassword(password, 'dasd')
    }

    /**
     * 
     * @param username 
     * @param password 
     */
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne(username);
        const salt = user.passwd_salt
        const hashPassword = encryptPassword(password, salt)
        if (user && user.password == hashPassword) {
            return user
        } else {
            return null
        }
    }

    async login(username, password) {
        const payload = { sub: username, password: password }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
