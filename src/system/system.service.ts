import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { iphone } from 'src/entities/phone.entity';
import { jsonParse } from 'src/utils/json';
import { Repository } from 'typeorm';

@Injectable()
export class SystemService {
    constructor(
        @InjectRepository(iphone) private readonly iphoneRepository: Repository<iphone>,
        private readonly mailerService: MailerService,
    ) { }

    /**
     * @param {type} category I am argument category. 
     * @description 根据用户传递的分类名称去匹配数据
     */
    async getDeafultData(category) {
        let sql = category ? `SELECT * from categories WHERE category = '${category}';` : 'SELECT * from categories;'
        let res = await this.iphoneRepository.query(sql)
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
        let res = await this.iphoneRepository.query(sql)
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
}
