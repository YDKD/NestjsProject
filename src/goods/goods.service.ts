import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { iphone } from 'src/entities/phone.entity';
import { UserService } from 'src/user/user.service';
import { get } from 'src/utils';
import { jsonParse } from 'src/utils/json';
import { Repository } from 'typeorm';
var axios = require('axios')
var xlsx = require('node-xlsx')
@Injectable()
export class GoodsService {
    constructor(
        @InjectRepository(iphone) private readonly iphonRepository: Repository<iphone>,
        private readonly userService: UserService
    ) { }
    // 获取热销宝贝-iphone手机信息
    async getHotIphoneData(currentPage, pageSize, user_id) {
        let checkTable = await this.userService.getUserConfigCheck(user_id)
        let sql = `SELECT * from ${checkTable} LIMIT ${currentPage - 1}, ${pageSize}`
        let result = await this.iphonRepository.query(sql)
        let total = jsonParse(await this.iphonRepository.query(`SELECT COUNT('user_id') FROM ${checkTable}`))
        total = parseInt(total[0]["COUNT('user_id')"]) || 0
        result = jsonParse(result)
        // let result = await this.iphonRepository.findAndCount({ skip: currentPage - 1, take: pageSize })
        return {
            total,
            result
        }
    }

    // 获取宝贝的发货地
    async getSendPlace(user_curr_place, user_id) {
        let checkTable = await this.userService.getUserConfigCheck(user_id)
        let res = await this.iphonRepository.query(`SELECT * FROM ${checkTable}`)
        let new_res = jsonParse(res)
        let place = []
        new_res.forEach((item) => {
            if (item.city) {
                place.push(item.city)
            } else {
                place.push(item.province)
            }
        })
        // 用户自己所在位置
        let user_city = user_curr_place
        // 用户所在坐标
        let user_place = ''
        await get('http://restapi.amap.com/v3/geocode/geo', {
            key: '257ece5abf371510c69e13639b9dc480',
            address: user_city,
        }).then(res => {
            let result: any = res
            user_place = result.geocodes[0].location
        })
        // 返回含坐标的数组
        let result_arr = []
        // 获取数据库中数据的经纬度，没有城市的按照省份来计算
        for (let i = 0; i < new_res.length; i += 10) {
            await get('http://restapi.amap.com/v3/geocode/geo', {
                key: '257ece5abf371510c69e13639b9dc480',
                address: place.splice(0, 10).join('|'),
                batch: true
            }).then(res => {
                let result: any = res
                result_arr = result_arr.concat(result.geocodes)
            })
        }
        // 返回的距离
        let result_distance_arr: any
        let location_str_arr = []
        result_arr.forEach(item => {
            location_str_arr.push(item.location)
        })
        console.log(location_str_arr.join('|'))
        console.log(user_place)
        await get('https://restapi.amap.com/v3/distance', {
            key: '257ece5abf371510c69e13639b9dc480',
            origins: location_str_arr.join('|'),
            destination: user_place,
            type: 1,
        }).then(res => {
            let result: any = res
            console.log(res)
            result_distance_arr = result.results
        })
        // 距离字符串转数字数组
        let result_distance_number_arr = []
        console.log(result_distance_arr)
        result_distance_arr.forEach(item => {
            result_distance_number_arr.push(parseInt(item.distance))
        })
        console.log(result_distance_number_arr)
        // 取出最小值
        var min = Math.min(...result_distance_number_arr)
        // 遍历数组，找出最小值的下标
        let min_index_arr = []
        result_distance_number_arr.forEach((item, i) => {
            if (item == min) {
                min_index_arr.push(i)
            }
        })

        // 最小值的城市数组对象
        let min_distance_arr_obj = []
        if (min_index_arr.length > 0) {
            min_index_arr.forEach(item => {
                min_distance_arr_obj.push(new_res[item])
            })
        } else {
            min_distance_arr_obj.push(new_res[min_index_arr[0]])
        }
        return min_distance_arr_obj
        // console.log(result_arr[distance_index])
    }

    // 导出数据
    async exportData(data, check) {
        let data_arr = []
        if (check == 1) {
            data.forEach(item => {
                let tmp_arr = []
                tmp_arr.push(item.id)
                tmp_arr.push(item.views_title)
                tmp_arr.push(item.commit_id)
                tmp_arr.push(item.img_pat)
                tmp_arr.push(item.views_price)
                tmp_arr.push(item.view_fee)
                tmp_arr.push(item.province)
                tmp_arr.push(item.city)
                tmp_arr.push(item.views_sales)
                tmp_arr.push(item.comment_count)
                tmp_arr.push(item.shop_name)
                tmp_arr.push(item.detail_url)
                tmp_arr.push(item.comment_url)
                tmp_arr.push(item.shop_link)
                tmp_arr.push(item.create_time)
                data_arr.push(tmp_arr)
            })
        } else {
            let res = await this.iphonRepository.find()
            let all_data = jsonParse(res)
            all_data.forEach(item => {
                let tmp_arr = []
                tmp_arr.push(item.id)
                tmp_arr.push(item.views_title)
                tmp_arr.push(item.commit_id)
                tmp_arr.push(item.img_pat)
                tmp_arr.push(item.views_price)
                tmp_arr.push(item.view_fee)
                tmp_arr.push(item.province)
                tmp_arr.push(item.city)
                tmp_arr.push(item.views_sales)
                tmp_arr.push(item.comment_count)
                tmp_arr.push(item.shop_name)
                tmp_arr.push(item.detail_url)
                tmp_arr.push(item.comment_url)
                tmp_arr.push(item.shop_link)
                tmp_arr.push(item.create_time)
                data_arr.push(tmp_arr)
            })
        }
        let sheet_name = ['商品id', '商品名', '评论id', '商品图片', '商品价格', '运费', '发货省份',
            '发货城市',
            '购买人数',
            '评论人数',
            '店铺名称',
            '商品详情',
            '评论地址',
            '店铺地址',
            '录入时间',
        ]
        data_arr.unshift(sheet_name)
        var buffer = xlsx.build([{ name: "mySheetName", data: data_arr }]);
        return buffer
    }
}
