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
cookie = '_uab_collina=161044538781433464813309; enc=TNsLXfmbCD6pu8OFqcjFb6NyvTotEnxoC8z7WKF9G8UL0LmoRqQuz9a%2FTt%2BlQG32%2BMpd2oUP%2Bc6jndccq7jmGg%3D%3D; thw=cn; UM_distinctid=1774d44ac825b0-0ab06ad92f595f-30614701-1fa400-1774d44ac836ac; hng=CN%7Czh-CN%7CCNY%7C156; cookie2=1e65c968ddb631c6357aaebff4d4c1a5; _tb_token_=eed5bb7eed13a; alitrackid=www.taobao.com; _samesite_flag_=true; t=3c05321e8246f165fed3524d305b20af; cna=DT+MF+4LTk4CAbaWLCkwz3+f; _m_h5_tk=4f509a04e252710b98cbb4e9a7efe9ca_1614053731897; _m_h5_tk_enc=0005d09b8eb1ae87140190de41f7c140; sgcookie=E100SVDVaBIYywJnylocJutwwyNq6p4vhU08tlbKGmsjQYi0z4JBziFuIdPm%2BRaqMHoc%2FnN09m4lD1nTkI6j6JWX7g%3D%3D; uc3=vt3=F8dCuASh6IGOZrB0iUU%3D&lg2=VFC%2FuZ9ayeYq2g%3D%3D&id2=UUkJZW6fmmVL2w%3D%3D&nk2=AQuBosO4j8I%3D; csg=c3812a88; lgc=boby%5Cu946B%5Cu604B; dnk=boby%5Cu946B%5Cu604B; skt=09bebb2f4db10226; existShop=MTYxNDA0NDAyOA%3D%3D; uc4=nk4=0%40A6ZBXnpzS01uTaZds949%2BPLAhw%3D%3D&id4=0%40U2uFU3CL5gIO6gpSGtHFmm%2FwH0SB; tracknick=boby%5Cu946B%5Cu604B; _cc_=UtASsssmfA%3D%3D; lastalitrackid=login.taobao.com; mt=ci=33_1; JSESSIONID=267D486D04D241F9C95AF9582DE34FA7; xlly_s=1; uc1=cookie14=Uoe1hgbVC6oV8A%3D%3D&pas=0&cookie21=U%2BGCWk%2F7p4mBoUyS4E9C&existShop=false&cookie16=UIHiLt3xCS3yM2h4eKHS9lpEOw%3D%3D; tfstk=ckP5Bea8S3xSE1Beaz_2arVf7alCZyIjoTi8P8ljv91dG0z5i0AZfq8uKnAxBq1..; isg=BKGhnTemZUQp0vZPJPJfOj3ysG27ThVAd6aZrQN2yKgHasA8S51cEbCozJ5soq14; l=eBPBH1F7Ok6okUyyBOfwnurza77tTIRfguPzaNbMiOCPOufp5lM5W6gRuDT9CnGVnsekR3u7hqDaBb8iCy4edxv9-eOh70eEEdLh.; x5sec=7b2274616f62616f2d73686f707365617263683b32223a223132633730306563656630623437623565326536373337623833633739636365434a364e306f45474550695868754c56704e667a77414561444449784e7a4d354d5467334e6a67374d7967434d4c7262355a66362f2f2f2f2f77453d227d'
# 搜索的商品名称
search_shop_name = '电脑'
save_goods_name = 'mac_store_new'


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
        # 店铺头像
        shop_pic = re.findall('"picUrl":"(.*?)"', html)
        print(len(shop_pic))
        print(shop_pic)
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
            shop_pic[i] = 'http:' + shop_pic[i]
            res = forMatter(shop_keywords[i])
            shop_wrap_res = shop_wrap[i].replace('\\', '')
            shop_wrap_res = shop_wrap_res + '}'
            shop_wrap_res = '{' + shop_wrap_res
            result = json.loads(shop_wrap_res)
            # print(res)
            # 数据加入
            list.append([
                shop_title[i], shop_pic[i], shop_pat[i], shop_rate_address[i], shop_loc[i], res, result['mas'], result['ind'], result['mg'], result['sas'], result['sg'], result['cas'], result['cg'], ])
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
            '(shop_title VARCHAR(100),shop_pic VARCHAR(1000), shop_pat VARCHAR(1000),shop_rate_address VARCHAR(1000), shop_loc VARCHAR(10), shop_keywords VARCHAR(1000), mas VARCHAR(100), ind VARCHAR(100), mg VARCHAR(100),sas VARCHAR(100), sg VARCHAR(100),cas VARCHAR(100), cg VARCHAR(100))CHARSET=utf8'
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
