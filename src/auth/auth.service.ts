/*
 * @Author: your name
 * @Date: 2021-01-04 11:56:27
 * @LastEditTime: 2021-01-18 18:04:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\auth\auth.service.ts
 */
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from 'src/common/common.service';
import { UserService } from 'src/user/user.service';
import { encryptPassword } from 'src/utils/cryptogram';
import { fileDisplay, getRouterList, result, result_data } from '../utils/index'
import dayjs = require('dayjs');
import { InjectRepository } from '@nestjs/typeorm';
import { iphone } from 'src/entities/phone.entity';
import { Repository } from 'typeorm';
import { last } from 'rxjs/operators';
import { jsonParse } from 'src/utils/json';
var fs = require('fs');
var compressing = require("compressing");
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly commonService: CommonService,
        @InjectRepository(iphone) private readonly iphoneRepository: Repository<iphone>
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
        if (user) {
            const salt = user.passwd_salt
            const hashPassword = encryptPassword(password, salt)
            if (user && user.password == hashPassword) {
                return user
            } else {
                return null
            }
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
        let res = await this.userService.findOneByName(username)
        if (res) {
            const salt = res.passwd_salt
            const hashPassword = encryptPassword(password, salt)
            if (res.password == hashPassword) {
                const payload = { sub: username, password: password }
                let access_token = this.jwtService.sign(payload)
                let userInfo = {
                    user_id: res.user_id,
                    username: res.username,
                    email: res.email,
                }
                // 用户信息字符串
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
            } else {
                return {
                    code: 50009,
                    msg: '密码错误'
                }
            }
        } else {
            return {
                code: 50008,
                msg: '未找到该用户信息'
            }
        }
    }

    async userRouterList(username) {
        let return_res = await this.iphoneRepository.query(`SELECT auth FROM user_entity WHERE username = '${username}'`)
        let res = jsonParse(return_res)
        // 获取用户对应的列表
        return await this.getUserRouterList(res[0].auth)

    }

    /**
     * @name: 退出登录
     * @param username
    */
    async logout(username) {
        let res = await this.commonService.set(username, '')
        return res
    }

    // 解access_token
    async decode(token) {
        return await this.jwtService.decode(token, { complete: true, json: true })

    }
    // 解密上传数据
    decrypt(data) {
        return this.commonService.decrypt(data)
    }

    // 加密返回数据
    async encryptData(data) {
        return await this.commonService.encrypt(data)
    }

    // 根据用户的权限列表去获取对应的列表
    async getUserRouterList(user_auth) {
        // 1、获取所有的路由列表
        let res = await this.iphoneRepository.query(`SELECT * FROM router_list`)
        let router_list = jsonParse(res)
        // 2、调用一个工具函数，根据用户的auth列表去确定用户有哪些列表
        let user_router_list = getRouterList(user_auth, router_list)
        return user_router_list
    }


    

    // 上传文件
    async uploadFile(file) {
        let dir = `./upload/${dayjs().format('YYYY-MM-DD')}/${file['originalname']}`
        let uploadFileName = file['originalname'].split('.')
        // 防止用户带日期或版本号上传
        let setFileName = uploadFileName.slice(0, uploadFileName.length - 1).join('.')
        let code = 200,
            msg = ''
        await compressing.zip.uncompress(dir, `./decompression/${dayjs().format('YYYY-MM-DD')}`)
            .then(async () => {
                let filePath = './decompression'
                await fileDisplay(filePath)
                if (result == 201) {
                    code = 201
                    msg = '文件读取失败'
                } else if (result == 202) {
                    code = 202
                    msg = 'Excel表格式不对'
                } else {
                    code = 200
                    msg = '文件上传解析成功'
                    let { data, thead } = result_data
                    const insertData = []
                    // 查询最后一条数据的id
                    let result_last_id = await this.iphoneRepository.query(`SELECT id FROM iphone ORDER BY id DESC LIMIT 1`)
                    if (result_last_id.length == 0) {
                        result_last_id = [
                            { id: 0 }
                        ]
                    }
                    let last_id = jsonParse(result_last_id)[0]['id']
                    console.log(last_id)
                    for (let i = 0; i < 3; i++) {
                        insertData.push({
                            id: last_id ? last_id + i + 1 : i,
                            views_title: data[i][thead[0]],
                            commit_id: data[i][thead[1]],
                            img_pat: data[i][thead[2]],
                            views_price: data[i][thead[3]],
                            view_fee: data[i][thead[4]],
                            province: data[i][thead[5]],
                            city: data[i][thead[6]],
                            views_sales: data[i][thead[7]],
                            comment_count: data[i][thead[8]],
                            shop_name: data[i][thead[9]],
                            detail_url: data[i][thead[10]],
                            comment_url: data[i][thead[11]],
                            shop_link: data[i][thead[12]],
                        })
                    }
                    console.log(insertData)
                    // this.iphoneRepository.save(insertData)
                    this.iphoneRepository.insert(insertData)
                    console.log(insertData)
                }

            })
            .catch(err => {
                return err
            });
        return {
            code, msg
        }
    }
}
