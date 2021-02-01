import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { iphone } from 'src/entities/phone.entity';
import { get } from 'src/utils';
import { jsonParse } from 'src/utils/json';
import { Repository } from 'typeorm';
var axios = require('axios')
@Injectable()
export class GoodsService {
    constructor(
        @InjectRepository(iphone) private readonly iphonRepository: Repository<iphone>
    ) { }
    // 获取热销宝贝-iphone手机信息
    async getHotIphoneData(currentPage, pageSize) {
        // let res = await this.iphonRepository.query(`SELECT * from iphone LIMIT ${currentPage - 1}, ${pageSize}`)
        let result = await this.iphonRepository.findAndCount({ skip: currentPage - 1, take: pageSize })
        return jsonParse(result)
    }

    // 获取宝贝的发货地
    async getSendPlace() {
        let res = await this.iphonRepository.query(`SELECT city,province FROM iphone`)
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
        let user_city = '重庆市'
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
        await get('https://restapi.amap.com/v3/distance', {
            key: '257ece5abf371510c69e13639b9dc480',
            origins: location_str_arr.join('|'),
            destination: user_place,
            type: 1,
        }).then(res => {
            let result: any = res
            result_distance_arr = result.results
        })
        // 距离字符串转数字数组
        let result_distance_number_arr = []
        result_distance_arr.map(item => {
            result_distance_number_arr.push(parseInt(item.distance))
        })
        console.log(result_distance_number_arr)
        // 取出最小值
        var min = Math.min(...result_distance_number_arr)
        // 遍历数组，找出最小值的下标
        let min_index_arr = []
        result_distance_number_arr.map((item, i) => {
            if(item == min) {
                min_index_arr.push(i)
            }
        })
        
        // 最小值的城市数组对象
        let min_distance_arr_obj = []
        if(min_index_arr.length > 0) {
            min_index_arr
        }
        console.log(new_res[min_index_arr[0]])
        // console.log(result_arr[distance_index])
    }
}
