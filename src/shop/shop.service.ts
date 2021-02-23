import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { iphone } from 'src/entities/phone.entity';
import { UserEntity } from 'src/entities/user.entity';
import { jsonParse } from 'src/utils/json';
import { Repository } from 'typeorm';

@Injectable()
export class ShopService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) { }
    choose_shop: string

    async getHotShopData(id, currentPage, pageSize) {
        // 根据用户id查询出用户配置的筛选类型
        let sql = `SELECT choose_type FROM user_entity WHERE user_id = ${id}`
        let res = await this.userRepository.query(sql)
        res = jsonParse(res)
        let choose_type = res[0].choose_type
        let user_choose_shop = choose_type.split(',')[1]
        
        // 根据筛选的类型，获取对应的店铺数据库表
        let choose_sql = `SELECT shop FROM categories WHERE type = '${user_choose_shop}'`
        let choose_res = await this.userRepository.query(choose_sql)
        choose_res = jsonParse(choose_res)
        let choose_shop = choose_res[0].shop
        this.choose_shop = choose_shop
        // 根据数据库表获取对应的数据
        return await this.pagingData(currentPage, pageSize, choose_shop, true, null, null)
    }

    async pagingData(currentPage, pageSize, checkTable, paging_sql, self_sql, self_total_sql) {
        let sql
        let total_sql

        total_sql = `SELECT COUNT(shop_pat) FROM ${checkTable}`

        // 计算返回结果
        if (paging_sql) {
            sql = `SELECT * from ${checkTable} LIMIT ${currentPage - 1}, ${pageSize}`
        } else {
            sql = self_sql
            total_sql = self_total_sql
        }
        let result = await this.userRepository.query(sql)
        result = jsonParse(result)

        // 计算总数
        let total = jsonParse(await this.userRepository.query(total_sql))
        total = paging_sql ? parseInt(total[0]['COUNT(shop_pat)']) : parseInt(total[0]['COUNT(mas)'])
        return {
            total,
            result
        }
    }

    async screenData(body) {
        let self_sql
        let total_sql
        let { currentPage, pageSize, check } = body
        let { goods_rate_min, goods_rate_max, seller_attitude_min, seller_attitude_max, logistics_quality_min, logistics_quality_max } = body.form
        if (check.length == 1) {
            if (check.includes(1)) {
                self_sql = `SELECT * FROM iphone_store WHERE (mas BETWEEN '${goods_rate_min}' AND '${goods_rate_max}' ) LIMIT ${currentPage - 1}, ${pageSize}`
                total_sql = `SELECT COUNT(mas) FROM iphone_store WHERE (mas BETWEEN '${goods_rate_min}' AND '${goods_rate_max}' )`
            } else if (check.includes(2)) {
                self_sql = `SELECT * FROM iphone_store WHERE (sas BETWEEN '${seller_attitude_min}' AND '${seller_attitude_max}' ) LIMIT ${currentPage - 1}, ${pageSize}`
                total_sql = `SELECT COUNT(mas) FROM iphone_store WHERE (sas BETWEEN '${seller_attitude_min}' AND '${seller_attitude_max}' )`
            } else if (check.includes(3)) {
                self_sql = `SELECT * FROM iphone_store WHERE (cas BETWEEN '${logistics_quality_min}' AND '${logistics_quality_max}' ) LIMIT ${currentPage - 1}, ${pageSize}`
                total_sql = `SELECT COUNT(mas) FROM iphone_store WHERE (cas BETWEEN '${logistics_quality_min}' AND '${logistics_quality_max}' )`
            }
        } else if (check.length == 2) {
            if (check.includes(1) && check.includes(2)) {
                self_sql = `SELECT * FROM iphone_store WHERE (sas BETWEEN '${seller_attitude_min}' AND '${seller_attitude_max}' ) AND (mas BETWEEN '${goods_rate_min}' AND '${goods_rate_max}' ) LIMIT ${currentPage - 1}, ${pageSize}`
                total_sql = `SELECT COUNT(mas) FROM iphone_store WHERE (sas BETWEEN '${seller_attitude_min}' AND '${seller_attitude_max}' ) AND (mas BETWEEN '${goods_rate_min}' AND '${goods_rate_max}' )`
            } else if (check.includes(1) && check.includes(3)) {
                self_sql = `SELECT * FROM iphone_store WHERE (cas BETWEEN '${logistics_quality_min}' AND '${logistics_quality_max}' ) AND (mas BETWEEN '${goods_rate_min}' AND '${goods_rate_max}' ) LIMIT ${currentPage - 1}, ${pageSize}`
                total_sql = `SELECT COUNT(mas) FROM iphone_store WHERE (cas BETWEEN '${logistics_quality_min}' AND '${logistics_quality_max}' ) AND (mas BETWEEN '${goods_rate_min}' AND '${goods_rate_max}' )`
            } else if (check.includes(2) && check.includes(3)) {
                self_sql = `SELECT * FROM iphone_store WHERE (cas BETWEEN '${logistics_quality_min}' AND '${logistics_quality_max}' ) AND (sas BETWEEN '${seller_attitude_min}' AND '${seller_attitude_max}' ) LIMIT ${currentPage - 1}, ${pageSize}`
                total_sql = `SELECT COUNT(mas) FROM iphone_store WHERE (cas BETWEEN '${logistics_quality_min}' AND '${logistics_quality_max}' ) AND (sas BETWEEN '${seller_attitude_min}' AND '${seller_attitude_max}' )`
            }
        } else if (check.length == 3) {
            self_sql = `SELECT * FROM iphone_store WHERE (cas BETWEEN '${logistics_quality_min}' AND '${logistics_quality_max}' ) AND (sas BETWEEN '${seller_attitude_min}' AND '${seller_attitude_max}' ) AND (mas BETWEEN '${goods_rate_min}' AND '${goods_rate_max}' ) LIMIT ${currentPage - 1}, ${pageSize}`
            total_sql = `SELECT COUNT(mas) FROM iphone_store WHERE (cas BETWEEN '${logistics_quality_min}' AND '${logistics_quality_max}' ) AND (sas BETWEEN '${seller_attitude_min}' AND '${seller_attitude_max}' ) AND (mas BETWEEN '${goods_rate_min}' AND '${goods_rate_max}' )`
        }
        return await this.pagingData(currentPage, pageSize, this.choose_shop, false, self_sql, total_sql)
    }
}
