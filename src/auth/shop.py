# -*- coding: utf-8 -*-
import requests
import re
import pandas as pd
import time
import random
import csv
import pymysql
import sys
import json
# 此处写入登录之后自己的cookies
cookie = '_uab_collina=161044538781433464813309; t=18672998b70005b7b03f4d84dbf0a119; enc=TNsLXfmbCD6pu8OFqcjFb6NyvTotEnxoC8z7WKF9G8UL0LmoRqQuz9a%2FTt%2BlQG32%2BMpd2oUP%2Bc6jndccq7jmGg%3D%3D; thw=cn; cookie2=22a4a951a85eded1d68c951b07c1a96b; _tb_token_=5ee8ee58e589b; alitrackid=www.taobao.com; _samesite_flag_=true; _m_h5_tk=d39e066500507c79654136ca3d48656d_1610621438768; _m_h5_tk_enc=fa0b9f73782b34da02f5896c3cc0f56c; lastalitrackid=login.taobao.com; xlly_s=1; mt=ci=0_0; cna=DT+MF+4LTk4CAbaWLCkwz3+f; x5sec=7b2274616f62616f2d73686f707365617263683b32223a223561373639393534636464386566313163613230613433366437646136333837434e326368494147454b616f324c69456b507a4870414561445449784e7a4d354d5467334e6a67374d54453d227d; JSESSIONID=DA36E35C5C5F62E4ABED57B5AE4546DD; l=eBPBH1F7Ok6okqrDBOfZlurza77TvIRfguPzaNbMiOCPOaCpWGihW6GjthY9CnGVnsND-3-Id_-7BcTSyy4edxv9-e_7XPQoUdLh.; isg=BBwcqq_lkC78T1s48dmKFdDZ7TrOlcC_0smhUfYda4fmQb3LHKHGTsDzoam5SfgX; tfstk=cjuABOmjYLv0QpN-TmKlCSyaGOdlZG1YIswOWB0YDRF5D7_OiCunJDZHc5WYyQC..; sgcookie=E100TQmJk3a0c4Krs%2BZ2RdpVKCsuIzwhyu0iHmsojFeM0Yx%2FksvBko8yyoufRX8EhJaLxEEz9xeWLGJhUYUR1avl1w%3D%3D; unb=2173918768; uc1=pas=0&cookie14=Uoe1gq4SXr91Hw%3D%3D&cookie16=VT5L2FSpNgq6fDudInPRgavC%2BQ%3D%3D&cookie15=W5iHLLyFOGW7aA%3D%3D&cookie21=V32FPkk%2FgihF%2FS5nr3O5&existShop=false; uc3=vt3=F8dCuAFf%2FI6gQIgDmWk%3D&id2=UUkJZW6fmmVL2w%3D%3D&nk2=AQuBosO4j8I%3D&lg2=URm48syIIVrSKA%3D%3D; csg=47b80b43; lgc=boby%5Cu946B%5Cu604B; cookie17=UUkJZW6fmmVL2w%3D%3D; dnk=boby%5Cu946B%5Cu604B; skt=5ae80961ff0f591e; existShop=MTYxMDY4MTk1Nw%3D%3D; uc4=id4=0%40U2uFU3CL5gIO6gpSGtHBzBU%2FDUkt&nk4=0%40A6ZBXnpzS01uTaZdt%2FNlysNkrg%3D%3D; tracknick=boby%5Cu946B%5Cu604B; _cc_=V32FPkk%2Fhw%3D%3D; _l_g_=Ug%3D%3D; sg=%E6%81%8B8a; _nk_=boby%5Cu946B%5Cu604B; cookie1=BvbYhTgJoagfvi2OFmKW4yeymDlsss71fxOW5fJpOnY%3D'
# 搜索的商品名称
search_shop_name = '相机'
save_goods_name = 'camera_store'


def getHTMLText(url):
    headers = {
        'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36'
    }
    user_cookies = cookie
    cookies = {}
    for a in user_cookies.split(';'):  # 因为cookies是字典形式，所以用spilt函数将之改为字典形式
        name, value = a.strip().split('=', 1)
        cookies[name] = value
    try:
        r = requests.get(url, cookies=cookies, headers=headers, timeout=60)
        print(r.status_code)
        print(r.cookies)
        return r.text
    except:
        print('获取页面信息失败')
        return ''


#  格式化页面，查找数据

def forMatter(str):
    tp = str.split(' ')
    index = 0
    for i in range(len(tp)):
        if(len(tp[i]) == 13):
            index = i
            break
    re = tp[:index]
    newArr = ' '.join(re)
    return newArr

def parsePage(html):
    list = []
    try:
        # 店铺名称
        shop_title = re.findall('"rawTitle":"(.*?)"', html)
        print(len(shop_title))  # 打印检索到数据信息的个数，如果此个数与后面的不一致，则数据信息不能加入列表
        print(shop_title)
        # 店铺地址
        shop_pat = re.findall('"shopUrl":"(//.*?)"', html)
        print(len(shop_pat))
        print(shop_pat)
        # 是否为天猫店铺
        shop_is_tmall = re.findall('"mas":"(.*?)"', html)
        # print(len(shop_is_tmall))
        print(shop_is_tmall)
        # 店铺评分地址
        shop_rate_address = re.findall('"userRateUrl":"(.*?)"', html)
        print(len(shop_rate_address))
        print(shop_rate_address)
        # 店铺所在省份
        shop_loc = re.findall('"provcity":"(.*?)"', html)
        print(len(shop_loc))
        print(shop_loc)
        shop_keywords = re.findall('"mainAuction":"(.*?)"', html)
        # print(len(shop_keywords))
        # print(shop_keywords)
        # 店铺详细信息
        shop_wrap = re.findall('"dsrStr":"{(.*?)}"', html)
        print(shop_wrap)

        for i in range(len(shop_title)):
            # 针对 URL中的 = 和 & 进行替换
            # detail_url[i] = detail_url[i].replace('\\u003d', '=')
            # 图片地址 http加入
            shop_pat[i] = 'http:' + shop_pat[i]
            res = forMatter(shop_keywords[i])
            shop_wrap_res = shop_wrap[i].replace('\\', '')
            # print(res)
            # 数据加入
            list.append([
                shop_title[i], shop_pat[i], shop_rate_address[i], shop_loc[i], res, shop_wrap_res])
        # print(list)
        print('爬取数据成功')
        return list
    except:
        print('有数据信息不全，如某一页面中某一商品缺少地区信息')


# 连接数据库
def connect_mysql(file_name, listData):
    # 连接MySQL数据库（注意：charset参数是utf8而不是utf-8）
    conn = pymysql.connect(host='localhost',
                           user='root',
                           password='123456',
                           db='iphone',
                           charset='utf8')

    # 创建游标对象
    cursor = conn.cursor()
    try:
        # sql1 = 'CREATE TABLE {table_name}(shop_title VARCHAR(100), shop_id VARCHAR(20), shop_pat VARCHAR(1000),  shop_is_tmall DECIMAL(10, 2), shop_rate_address INT(2), province VARCHAR(10), city VARCHAR(10), shop_loc VARCHAR(7), comment_count INT(10), shop_name VARCHAR(20), detail_url VARCHAR(1000), comment_url  VARCHAR(1000), shop_link    VARCHAR(1000))CHARSET = utf8'
        sql1 = 'CREATE TABLE '+file_name + \
            '(shop_title VARCHAR(100),shop_pat VARCHAR(1000),shop_rate_address VARCHAR(1000), shop_loc VARCHAR(10), shop_keywords VARCHAR(1000), shop_wrap_info VARCHAR(1000))CHARSET=utf8'
        cursor.execute(sql1)
    except:
        print('创建数据库失败')
    # # 一行一行地存，除去第一行和第一列
    for each in list(listData):
        i = tuple(each[:])
        # 使用SQL语句添加数据
        sql = 'INSERT INTO ' + file_name + ' VALUES' + str(i)  # db_top100是表的名称
        cursor.execute(sql)  # 执行SQL语句
        print('数据写入中')
    try:
        conn.commit()  # 提交数据
        cursor.close()  # 关闭游标
        print('数据存储成功')
    except:
        print('提交失败')
    conn.close()  # 关闭数据库


def main():
    goods = search_shop_name  # 输入想搜索的商品名称
    file_name = save_goods_name  # 输入想保存的商品名称
    depth = 8  # 爬取的页数
    start_url = 'https://shopsearch.taobao.com/search?q=' + goods  # 初始搜索地址
    result = []
    for i in range(depth):
        time.sleep(random.randint(10, 15))
        try:
            page = i + 1
            print('正在爬取第%s页数据' % page)
            if(page >= 2):
                url = start_url + \
                    '&js=1&initiative_id=staobaoz_20210115&ie=utf8&s=' + \
                    str(20 * i)
            else:
                url = start_url + \
                    '&js=1&initiative_id=staobaoz_20210115&ie=utf8' + \
                    str(44 * i)
            html = getHTMLText(url)
            list = parsePage(html)
            result.extend(list)
        except:
            print('数据没保存成功')
    connect_mysql(file_name, result)


if __name__ == '__main__':
    main()
