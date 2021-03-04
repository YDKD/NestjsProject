import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { iphone } from 'src/entities/phone.entity';
import { UserEntity } from 'src/entities/user.entity';
import { jsonParse } from 'src/utils/json';
import { Repository } from 'typeorm';
import { parseTime } from 'src/utils/index'
import { encryptPassword } from 'src/utils/cryptogram';

@Injectable()
export class SystemService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly mailerService: MailerService,
        private readonly commonService: CommonService
    ) { }

    /**
     * @param {type} category I am argument category. 
     * @description 根据用户传递的分类名称去匹配数据
     */
    async getDeafultData(category) {
        let sql = category ? `SELECT * from categories WHERE category = '${category}';` : 'SELECT * from categories;'
        let res = await this.userRepository.query(sql)
        res = jsonParse(res)
        return res
    }

    /**
     * @param {type} body I am argument body. 
     * @param {type} user_id I am argument user_id. 
     * @description 保存用户配置的筛选条件
     */
    async saveConfigCategory(body, user_id) {
        let str = body.category + ',' + body.brand + ',' + body.product
        let sql = `UPDATE user_entity SET choose_type = '${str}' WHERE user_id = ${user_id}`
        let res = await this.userRepository.query(sql)
        let msg = res.affectedRows == 1 ? '配置成功' : '配置失败'
        let code = res.affectedRows == 1 ? 200 : 201
        return {
            code,
            msg
        }
    }

    /**
     * @param {type} data I am argument data. 
     * @description 传递用户自定义筛选条件
     */
    async configureCustom(data, user_id) {
        return this.mailerService.sendMail({
            to: '1606354057@qq.com',
            subject: "Foss-Store爬取内容",
            html: `<h1>用户id为：${user_id}，爬取的内容是：${data}</h1>`,
        }).then((res) => {
            return 200
        }).catch((error) => {
            return 201
        })
    }


    async getAllUser(id) {
        let userInfo = await this.userRepository.find({ select: ['role'], where: { user_id: id } })
        userInfo = jsonParse(userInfo)
        if (userInfo[0].role == 3) {
            let res = await this.userRepository.find({ select: ['username', 'email', 'role', 'user_status', 'create_time', 'effective_time', 'user_id', 'create_by', 'auth', 'user_login_place'], where: { user_status: 1 } })
            let res2 = await this.userRepository.find({ select: ['username', 'email', 'role', 'user_status', 'create_time', 'effective_time', 'user_id', 'create_by', 'auth', 'user_login_place'], where: { user_status: 0 } })
            res = jsonParse(res)
            res2 = jsonParse(res2)
            let total = [...res, ...res2]
            return total
        } else {
            return {
                code: 1,
                msg: '权限不足，拒绝访问！'
            }
        }

    }

    async modifyUserData(data) {
        let decryptData = this.commonService.decrypt(data)
        let { user_id, username, effective_time, modify_username } = decryptData
        effective_time = parseTime(effective_time, '{y}-{m}-{d} {h}:{i}:{s}')
        let sql
        if (modify_username) {
            sql = `UPDATE user_entity SET effective_time = '${effective_time}', username = '${username}' WHERE user_id = ${user_id}`
        } else {
            sql = `UPDATE user_entity SET effective_time = '${effective_time}' WHERE user_id = ${user_id}`
        }
        let res = await this.userRepository.query(sql)
        res = jsonParse(res)
        if (res.affectedRows > 0) {
            return {
                code: 0,
                msg: '修改成功'
            }
        } else {
            return {
                code: -1,
                msg: '修改失败'
            }
        }
    }

    async resetPsw(user_id) {
        let res = await this.userRepository.find({ select: ['passwd_salt'], where: { user_id: user_id } })
        let res_obj = jsonParse(res)[0]
        let passwd_salt = res_obj.passwd_salt
        let new_hash_psw = encryptPassword('000000', passwd_salt)
        let sql = `UPDATE user_entity SET password = '${new_hash_psw}' WHERE user_id = ${user_id}`
        let result = await this.userRepository.query(sql)
        result = jsonParse(result)
        if (result.affectedRows > 0) {
            return {
                code: 0,
                msg: '密码重置成功'
            }
        } else {
            return {
                code: -1,
                msg: '密码重置失败'
            }
        }
    }

    async deleteUser(delete_id:string) {
        let sql
        let arr = delete_id.length > 0 ? delete_id.split(',') : [delete_id]
        sql = `UPDATE user_entity SET user_status = 2 WHERE FIND_IN_SET(user_id,'${delete_id}')`
        let result = await this.userRepository.query(sql)
        result = jsonParse(result)
        if (result.affectedRows == arr.length) {
            return {
                code: 0,
                msg: '删除成功'
            }
        } else {
            return {
                code: -1,
                msg: '删除失败'
            }
        }
    }
}
