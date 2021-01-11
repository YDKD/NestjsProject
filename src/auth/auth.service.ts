/*
 * @Author: your name
 * @Date: 2021-01-04 11:56:27
 * @LastEditTime: 2021-01-11 14:22:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\auth\auth.service.ts
 */
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from 'src/common/common.service';
import { UserService } from 'src/user/user.service';
import { encryptPassword } from 'src/utils/cryptogram';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly commonService: CommonService
    ) { }

    public access_token: string
    public exp: number
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
        let access_token = this.jwtService.sign(payload)
        let res = await this.userService.findOneByName(username)
        let userInfo = {
            user_id: res.user_id,
            username: res.username,
            email: res.email,
            role: res.role,
        }
        let userInfoStringfy = JSON.stringify(userInfo)
        // 返回 token
        let return_token = access_token + ':' + await this.commonService.encrypt(userInfoStringfy)
        // redis 存储token
        this.commonService.set(username, access_token)
        let exptime = this.jwtService.verify(this.jwtService.sign(payload)).exp * 1000
        this.access_token = access_token
        this.exp = exptime
        return {
            access_token: return_token,
            exp: exptime
        }
    }

    async decode(token) {
        return await this.jwtService.decode(token, { complete: true, json: true })

    }

    decrypt(data) {
        return this.commonService.decrypt(data)
    }

    async encryptData(data) {
        return await this.commonService.encrypt(data)
    }

}
