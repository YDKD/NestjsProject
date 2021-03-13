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
import { fileDisplay, getRouterList, parseTime, result, result_data, rTime, total } from '../utils/index'
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
    public upload_status: number
    public msg: string
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
        let res = await this.iphoneRepository.query(`SELECT * FROM user_entity WHERE username = '${username}'`)
        res = jsonParse(res)[0]
        if (!res || res.user_status == 2) {
            return {
                code: 50008,
                msg: '未找到该用户信息'
            }
        } else {
            let effective_time = res.effective_time
            effective_time = rTime(effective_time)
            let eff_time_stamp = new Date(effective_time).getTime()
            let current_time_stamp = new Date().getTime()
            if (res.user_status == 0 || current_time_stamp > eff_time_stamp) {
                await this.iphoneRepository.query(`UPDATE user_entity SET user_status = 0 WHERE user_id = ${res.user_id}`)
                return {
                    code: 50007,
                    msg: '账号已过期'
                }
            }
            const salt = res.passwd_salt
            const hashPassword = encryptPassword(password, salt)
            if (res.password == hashPassword) {
                const payload = { sub: username, password: password }
                let access_token = this.jwtService.sign(payload)
                let userInfo = {
                    user_id: res.user_id,
                    username: res.username,
                    email: res.email,
                    role: res.role,
                    choose_type: res.choose_type
                }
                // 用户信息字符串
                let userInfoStringfy = JSON.stringify(userInfo)
                // 返回 token
                let return_token = access_token + ':' + await this.commonService.encrypt(userInfoStringfy, true)
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
    async encryptData(data, isDecryptUser) {
        return await this.commonService.encrypt(data, isDecryptUser)
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

    // 返回用户地图
    async userMap() {
        return 'https://www.ydkd.vip/ad782b2e3d9cfad0f9d3.html/a.html'
    }



    // 上传文件
    async uploadFile(file, note_user_id, category, upload_user_name, brand, product) {
        this.upload_status = 0
        this.msg = '开始解压文件'
        let dir = `./upload/${dayjs().format('YYYY-MM-DD')}/${file['originalname']}`
        let uploadFileName = file['originalname'].split('.')
        // 防止用户带日期或版本号上传
        let setFileName = uploadFileName.slice(0, uploadFileName.length - 1).join('.')
        await compressing.zip.uncompress(dir, `./decompression/${dayjs().format('YYYY-MM-DD')}`)
            .then(async () => {
                let filePath = './decompression'
                await fileDisplay(filePath)
                if (result == 201) {
                    this.upload_status = 1
                    this.msg = '文件读取失败'
                } else if (result == 202) {
                    this.upload_status = 2
                    this.msg = 'Excel表格式不对'
                } else {
                    this.msg = '文件上传解析成功'
                    this.upload_status = 3
                    let { data, thead } = result_data
                    const insertData = []
                    for (let i = 1; i < total; i++) {
                        insertData.push({
                            id: i,
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

                    // 创建数据库
                    let sql = `CREATE TABLE ${product}  (
                        views_title varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                        commit_id varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                        img_pat varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                        views_price decimal(10, 2) NULL DEFAULT NULL,
                        view_fee int(0) NULL DEFAULT NULL,
                        province varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                        city varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                        views_sales varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                        comment_count varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                        shop_name varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                        detail_url varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                        comment_url varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                        shop_link varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                        create_time timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
                        update_time timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '修改时间',
                        id int(0) NOT NULL AUTO_INCREMENT,
                        PRIMARY KEY (id) USING BTREE
                      ) ENGINE = InnoDB AUTO_INCREMENT = 45 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;`
                    let res = await this.iphoneRepository.query(sql)
                    // 查看数据的表是否创建成功
                    let tables = await this.iphoneRepository.query(`SHOW TABLES`)
                    tables = jsonParse(tables)
                    let tables_arr = []
                    tables.map(item => {
                        tables_arr.push(item['Tables_in_test'])
                    })
                    if (tables_arr.includes(product.toLowerCase())) {
                        this.upload_status = 4
                        this.msg = '数据库创建成功,插入数据中'
                    }

                    // 编写插入数据的SQL
                    let insert_sql = `INSERT INTO ${product} (id, views_title, commit_id, img_pat, views_price, view_fee, province, city, views_sales, comment_count, shop_name, detail_url, comment_url, shop_link) VALUES `
                    insertData.map(item => {
                        let tmp_value = ''
                        for (let i in item) {
                            tmp_value += `'${item[i]}',`
                        }
                        tmp_value = tmp_value.substring(0, tmp_value.length - 1)
                        insert_sql += `(${tmp_value}),`
                    })
                    insert_sql = insert_sql.substring(0, insert_sql.length - 1)
                    let insert_res = await this.iphoneRepository.query(insert_sql)
                    if (insert_res.affectedRows == insertData.length) {
                        this.upload_status = 5
                        this.msg = '数据全部插入成功'
                    } else {
                        this.upload_status = 6
                        this.msg = '部分数据插入成功'
                    }
                    // 入库上传信息
                    let time = parseTime(new Date().getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
                    product = product.toLowerCase()
                    let inser_into_upload_info_sql = `INSERT INTO upload_info (filename, upload_user_name, create_time, upload_status, msg, upload_table) VALUES('${file['originalname']}', '${upload_user_name}', '${time}', ${this.upload_status}, '${this.msg}', '${product}')`
                    await this.iphoneRepository.query(inser_into_upload_info_sql)
                }

            })
            .catch(err => {
                return err
            });
        return {
            // filename: file['originalname'],
            // upload_user_name: upload_user_name,
            // create_time: new Date().getTime(),
            // msg: this.msg,
            // upload_status: this.upload_status
        }
    }

    async getTables(user_id) {
        let sql = `SELECT role FROM user_entity WHERE user_id = ${user_id}`
        let res = await this.iphoneRepository.query(sql)
        res = jsonParse(res)[0]
        if (res['role'] === 3) {
            let tables = await this.iphoneRepository.query(`SHOW TABLES`)
            tables = jsonParse(tables)
            let tables_arr = []
            tables.map(item => {
                tables_arr.push(item['Tables_in_test'])
            })
            return this.encryptData(tables_arr, false)
        } else {
            return {
                code: 201,
                msg: '用户权限校验失败'
            }
        }
    }

    async getUploadTables() {
        let res = await this.iphoneRepository.query(`SELECT * FROM upload_info `)
        res = jsonParse(res)
        return res
    }
}
