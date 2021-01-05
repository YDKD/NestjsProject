import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { encryptPassword } from 'src/utils/cryptogram';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    /**
     * @name: 
     * @param {string} password
     * @return {*}
     */
    encrypt(password: string) {
        return encryptPassword(password, 'dasd')
    }


    /**
     * @name: 
     * @param {string} username
     * @param {string} password
     * @return {*}
     */
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOneByName(username);
        const salt = user.passwd_salt
        const hashPassword = encryptPassword(password, salt)
        if (user && user.password == hashPassword) {
            return user
        } else {
            return null
        }
    }

    /**
     * @name: 
     * @param {*} username
     * @param {*} password
     * @return {*}
     */
    async login(username, password) {
        const payload = { sub: username, password: password }
        return {
            access_token: this.jwtService.sign(payload),
            exp: this.jwtService.verify(this.jwtService.sign(payload)).exp * 10000
        }
    }

    async register(username, password, email) {
        return await this.userService
    }

}
