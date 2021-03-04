import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { iphone } from 'src/entities/phone.entity';
import { ShopService } from 'src/shop/shop.service';
import { jsonParse } from 'src/utils/json';
import { Repository } from 'typeorm';

@Injectable()
export class SellerService {
    constructor(
        @InjectRepository(iphone) private readonly iphoneRepository: Repository<iphone>,
        private readonly shopService: ShopService
    ) { }


    async getProvinceData(user_id) {
        let sql = `SELECT choose_type FROM user_entity WHERE user_id = ${user_id}`
        let res = await this.iphoneRepository.query(sql)
        res = jsonParse(res)
        let choose_type = res[0].choose_type
        let user_choose_product = choose_type.split(',')[2]
        console.log(user_choose_product)
        // 统计交易量
        let sql_account_product = `SELECT province, views_sales, views_price * views_price as 'total_amount' FROM ${user_choose_product}`
        // 统计相同省份数
        let sql_account_province = `SELECT province, COUNT(id) FROM ${user_choose_product} GROUP BY province`
        let res_product = await this.iphoneRepository.query(sql_account_product)
        let res_province = await this.iphoneRepository.query(sql_account_province)
        res_product = jsonParse(res_product)
        res_province = jsonParse(res_province)
        let product = res_product
        let province = res_province
        return {
            product,
            province
        }
    }

    async getCityData(user_id) {
        let sql = `SELECT choose_type FROM user_entity WHERE user_id = ${user_id}`
        let res = await this.iphoneRepository.query(sql)
        res = jsonParse(res)
        let choose_type = res[0].choose_type
        let user_choose_product = choose_type.split(',')[2]
        // 统计交易量
        let sql_account_product = `SELECT city, views_sales, views_price * views_price as 'total_amount' FROM ${user_choose_product} WHERE city != ''`
        // 统计相同城市数
        let sql_account_city = `SELECT city, COUNT(id) FROM ${user_choose_product} WHERE city != '' GROUP BY city`
        let res_product = await this.iphoneRepository.query(sql_account_product)
        let res_city = await this.iphoneRepository.query(sql_account_city)
        res_product = jsonParse(res_product)
        res_city = jsonParse(res_city)
        let product = res_product
        let city = res_city
        return {
            product,
            city
        }
    }


}
