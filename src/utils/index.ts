/*
 * @Author: your name
 * @Date: 2021-01-05 17:24:39
 * @LastEditTime: 2021-01-18 18:09:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\utils\index.ts
 */

import { BadRequestException, HttpCode, HttpException, HttpStatus } from "@nestjs/common";

//随机数
var fs = require('fs')
var path = require('path')
var result = 300
var result_data: any
var axios = require('axios')
import { readFile, utils } from 'xlsx'
function random(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}

//随机4位验证码
export function verifyCode() {
    //将数字、小写字母及大写字母输入
    var str = "1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM";
    //给一个空字符串
    var res = '';
    //循环4次，得到4个字符
    for (var i = 0; i < 4; i++) {
        //将得到的结果给字符串，调用随机函数，0最小数，62表示数字加字母的总数
        res += str[random(0, 62)];
    }
    return res
}


// 判断验证码是否过期
export function codeOverdue(startime, stoptime) {
    if (startime < stoptime) {
        let currTime = ++startime
        codeOverdue(currTime, stoptime)
    } else {
        return true
    }
}


// 读取文件
export function fileDisplay(filePath) {
    let files = fs.readdirSync(filePath)
    files.forEach((filename) => {
        //获取当前文件的绝对路径  
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象  
        let stats = fs.statSync(filedir)
        if (!stats) {
            result = 201
        } else {
            var isFile = stats.isFile();//是文件  
            var isDir = stats.isDirectory();//是文件夹  
            if (isFile) {
                let suffix = filedir.split('.')
                let suffixArr = ['xls', 'xlsx', 'csv']
                if (!suffixArr.includes(suffix[1])) {
                    throw new HttpException('文件类型不符合', HttpStatus.NOT_FOUND)
                } else {
                    let workbook = readFile(filedir, { type: 'binary' })
                    // console.log(workbook)
                    const sheetNames = workbook.SheetNames; //获取表名
                    const sheet = workbook.Sheets[sheetNames[0]]; //通过表名得到表对象
                    const thead = [
                        sheet.A1.v,
                        sheet.B1.v,
                        sheet.C1.v,
                        sheet.D1.v,
                        sheet.E1.v,
                        sheet.F1.v,
                        sheet.G1.v,
                        sheet.H1.v,
                        sheet.I1.v,
                        sheet.J1.v,
                        sheet.K1.v,
                        sheet.L1.v,
                        sheet.M1.v,
                    ];
                    const data = utils.sheet_to_json(sheet, { defval: '' }); //通过工具将表对象的数据读出来并转成json
                    const theadRule = [
                        'views_title',
                        'commit_id',
                        "img_pat",
                        'views_price',
                        'view_fee',
                        'province',
                        'city',
                        'views_sales',
                        'comment_count',
                        'shop_name',
                        'detail_url',
                        'comment_url',
                        'shop_link',
                    ];
                    const isValid = thead.every((value, index) => value === theadRule[index]); //检验表字段
                    if (!isValid) {
                        console.log(444)
                        result = 202

                    } else {
                        result = 200
                        result_data = {
                            data,
                            thead
                        }
                        console.log(333)
                    }
                }
            }
            if (isDir) {
                fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件  
            }
        }
    })
}

// 确定用户的权限列表
export function getRouterList(user_auth: any, allRouterList) {
    let user_auth_arr = user_auth.split(',')
    let userRouterList = []
    user_auth_arr.map((rid) => {
        allRouterList.map((router) => {
            if (router.id.toString() == rid) {
                userRouterList.push(router)
            }
        })
    })
    return userRouterList
}

export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    })
}

export {
    result,
    result_data
}
