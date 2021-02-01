# -*- coding: utf-8 -*-
import requests
import re
import pandas as pd
import time
import random
import csv
import pymysql
import sys
# 此处写入登录之后自己的cookies
cookie = '_uab_collina=161044538781433464813309; alitrackid=login.taobao.com; lastalitrackid=login.taobao.com; x5sec=7b2274616f62616f2d73686f707365617263683b32223a223763653962343535346534313135633835636438613536663438383864363162434b6e532f763846454d6d576f35717039634f4a4e526f4d4d6a45334d7a6b784f4463324f44737a227d; _samesite_flag_=true; cookie2=1f65ca4d1b132889b87e8de0c2600198; t=18672998b70005b7b03f4d84dbf0a119; _tb_token_=345b3574eda08; sgcookie=E100QrDoY7ocMfRjJ%2FJS6RvOtV3lboD2il8Hb4Bhi5l8sV1yJb0O6JYuY8Xyfg17I1Ehn4apYgbLnViYfa7CmAWGlw%3D%3D; unb=2173918768; uc3=vt3=F8dCuAFcT0%2F8cvbhaPo%3D&lg2=V32FPkk%2Fw0dUvg%3D%3D&nk2=AQuBosO4j8I%3D&id2=UUkJZW6fmmVL2w%3D%3D; csg=9aeb26fc; lgc=boby%5Cu946B%5Cu604B; cookie17=UUkJZW6fmmVL2w%3D%3D; dnk=boby%5Cu946B%5Cu604B; skt=5978da0e0e40f611; existShop=MTYxMDU5MDU1MA%3D%3D; uc4=id4=0%40U2uFU3CL5gIO6gpSGtHBzx0T8Vmz&nk4=0%40A6ZBXnpzS01uTaZdt%2FCv5kY6xw%3D%3D; tracknick=boby%5Cu946B%5Cu604B; _cc_=Vq8l%2BKCLiw%3D%3D; _l_g_=Ug%3D%3D; sg=%E6%81%8B8a; _nk_=boby%5Cu946B%5Cu604B; cookie1=BvbYhTgJoagfvi2OFmKW4yeymDlsss71fxOW5fJpOnY%3D; enc=TNsLXfmbCD6pu8OFqcjFb6NyvTotEnxoC8z7WKF9G8UL0LmoRqQuz9a%2FTt%2BlQG32%2BMpd2oUP%2Bc6jndccq7jmGg%3D%3D; mt=ci=34_1; uc1=cookie21=VFC%2FuZ9aiKCaj7AzMHh1&cookie14=Uoe1gq3dnbvBqg%3D%3D&cookie16=UIHiLt3xCS3yM2h4eKHS9lpEOw%3D%3D&existShop=false&pas=0&cookie15=U%2BGCWk%2F75gdr5Q%3D%3D; thw=cn; cna=DT+MF+4LTk4CAbaWLCkwz3+f; xlly_s=1; JSESSIONID=6BF090F523CF854D2E943C636C667576; isg=BO7uNFh0PSZeyUl2H_PYA5aDP0Sw77LpVEMTHxi3Q_Gs-45VgH-Y-ADxs2cXI6oB; tfstk=cB6lBOw01_RWnaRc1895jmH4SJNAZvPyP9WV3tg_1bWccgWVi6hq_7i8mUQlpX1..; l=eBPBH1F7Ok6okvQbBOfZnurza77T_IRAguPzaNbMiOCP9wfp5GelWZ83FuY9CnGVh646R3-Id_-7BeYBqhYan5U68yvNIskmn'
# 搜索的商品名称
search_goods_name = 'macbook'
# 保存的商品名称
save_goods_name = 'macbook'
# 获取页面信息


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


def parsePage(html):
    list = []
    try:
        # 商品名称
        views_title = re.findall('"raw_title":"(.*?)"', html)
        print(len(views_title))  # 打印检索到数据信息的个数，如果此个数与后面的不一致，则数据信息不能加入列表
        print(views_title)
        # 商品id
        commit_id = re.findall('"nid":"(.*?)"', html)
        print(len(commit_id))
        print(commit_id)
        # 商品图片
        img_pat = re.findall('"pic_url":"(//.*?)"', html)
        print(len(img_pat))
        print(img_pat)
        # 商品价格
        views_price = re.findall('"view_price":"(.*?)"', html)
        print(len(views_price))
        print(views_price)
        # 商品运费
        view_fee = re.findall('"view_fee":"(.*?)"', html)
        print(len(view_fee))
        print(view_fee)
        # 收货人数
        views_sales = re.findall('"view_sales":"(.*?)"', html)
        print(len(views_sales))
        print(views_sales)
        # 发货地点
        item_loc = re.findall('"item_loc":"(.*?)"', html)
        print(len(item_loc))
        print(item_loc)
        # 评论人数
        comment_count = re.findall('"comment_count":"(.*?)","user_id"', html)
        print(len(comment_count))
        print(comment_count)
        # 店铺名称
        shop_name = re.findall('"nick":"(.*?)","shopcard"', html)
        print(len(shop_name))
        print(shop_name)
        # 商品详细地址
        detail_url = re.findall('"detail_url":"(.*?)"', html)
        print(len(detail_url))
        print(detail_url)
        # 评论链接
        comment_url = re.findall('"comment_url":"(.*?)"', html)
        print(len(comment_url))
        print(comment_url)
        # 店铺地址
        shop_link = re.findall('"shopLink":"(.*?)"', html)
        print(len(shop_link))
        print(shop_link)
        for i in range(len(views_price)):
            # 针对 URL中的 = 和 & 进行替换
            detail_url[i] = detail_url[i].replace('\\u003d', '=')
            detail_url[i] = detail_url[i].replace('\\u0026', '&')
            comment_url[i] = comment_url[i].replace('\\u003d', '=')
            comment_url[i] = comment_url[i].replace('\\u0026', '&')
            shop_link[i] = shop_link[i].replace('\\u003d', '=')
            shop_link[i] = shop_link[i].replace('\\u0026', '&')
            # 图片地址 http加入
            img_pat[i] = 'http:' + img_pat[i]
            detail_url[i] = 'http:' + detail_url[i]
            comment_url[i] = 'http:' + comment_url[i]
            shop_link[i] = 'http:' + shop_link[i]
            # 省份城市进行分割
            province = item_loc[i][0:2:]
            city = item_loc[i][3:]
            # 收货人数截取
            views_sales[i] = views_sales[i][:-3]
            if (comment_count[i] == ''):
                comment_count[i] = 0
            # 数据加入
            list.append([
                views_title[i], commit_id[i], img_pat[i], views_price[i],
                view_fee[i], province, city, views_sales[i], comment_count[i],
                shop_name[i], detail_url[i], comment_url[i], shop_link[i]
            ])
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
        # sql1 = 'CREATE TABLE {table_name}(views_title VARCHAR(100), commit_id VARCHAR(20), img_pat VARCHAR(1000),  views_price DECIMAL(10, 2), view_fee INT(2), province VARCHAR(10), city VARCHAR(10), views_sales VARCHAR(7), comment_count INT(10), shop_name VARCHAR(20), detail_url VARCHAR(1000), comment_url  VARCHAR(1000), shop_link    VARCHAR(1000))CHARSET = utf8'
        sql1 = 'CREATE TABLE ' + file_name + \
            '(views_title VARCHAR(100),commit_id VARCHAR(20),img_pat VARCHAR(1000),views_price DECIMAL(10, 2),view_fee INT(2), province VARCHAR(10),city VARCHAR(10), views_sales VARCHAR(10),comment_count VARCHAR(10), shop_name VARCHAR(20),detail_url VARCHAR(1000),comment_url  VARCHAR(1000), shop_link VARCHAR(1000))CHARSET=utf8;'
        cursor.execute(sql1)
    except:
        print('创建数据库失败')
    # 一行一行地存，除去第一行和第一列
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
    goods = search_goods_name  # 输入想搜索的商品名称
    file_name = save_goods_name  # 输入想保存的商品名称
    depth = 5  # 爬取的页数
    start_url = 'https://s.taobao.com/search?q=' + goods  # 初始搜索地址
    for i in range(depth):
        time.sleep(random.randint(10, 15))
        try:
            page = i + 1
            print('正在爬取第%s页数据' % page)
            url = start_url + \
                '&imgfile=&js=1&stats_click=search_radio_all%3A1&initiative_id=staobaoz_20210112&ie=utf8&style=grid&sort=sale-desc&bcoffset=0&p4ppushleft=%2C44&s=' + \
                str(44 * i)

            html = getHTMLText(url)
            list = parsePage(html)
        except:
            print('数据没保存成功')
    connect_mysql(file_name, list)


if __name__ == '__main__':
    main()
