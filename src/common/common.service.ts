/*
 * @Author: your name
 * @Date: 2021-01-07 18:08:51
 * @LastEditTime: 2021-01-11 12:32:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\common\common.service.ts
 */
import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
// 私钥解密
var NodeRSA = require('node-rsa')
const privatekey = `-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALciejdMq0x7ZR9h
4qacfVeL0Z+cGJgIMftrCWcwxEArIE/7gVdNhpzDuONdZZSifXGb8lw5ciDPk+5F
aYQd1Co8Qy8gXHsHbGMfU28yb20puC/cOML65gGqrCwNYBpQeYVPH2oTkKXS9o1I
IdCEk7qO1u+vq2sYI5AFilOJMbpJAgMBAAECgYEAlrm+oxLsDZelo82ZkI1NsCc4
kUgVCdP85zOyWobNjw6vmoSicGszNoTz/9WXzFxsKHw0Xek94HlYBIyGiqFOQ0w4
YV5WST5y1msqJxUTY7lAsKu6hck6zEDxtwjzjpmyG6/j7RrfV5xe1WVPRwzvFOh6
yn0i5WJkVknxMcrOcoECQQDcucvyLQ5WjW/SZyQTBrXadKtGsmyC7glvdsLxoj6a
RH+XW2XlfuQYa4FbKt8pkMAnyQCtPOiW4YJP6he3cacRAkEA1GbGq2c+1w7CLaXz
Rqg12hXT2ftLJA88zKhna5sx4XqNCLF80Tz8mJBObp2NkVW7XyTkA1wuv8P4Wcbs
1uYPuQJAF0Cbc4+7ivKrbQbgjgCO98yCnpf9Rm29ILjqIHpvDeFZb6B5Q4vyi4AH
yIrjp4VQOOC76YQZHIv1JmYKyZB3gQJARXkIam/uwfD12nB5Thce5iJVlOr4/OZv
AJHkofG1MwceskU7ikTkahJpVQz7jRn5m3k5i0/PirHSvaqvNOszIQJBAKfKLxg6
XwJINGPaz3TNtJP85KWu6kUMScClbSmEi/q+TcFqilmVnpvvukPjp9RUwcDKr+TD
XEJ2tTlh767w17g=
-----END PRIVATE KEY-----`
const key = new NodeRSA();
key.setOptions({ encryptionScheme: 'pkcs1' })
key.importKey(privatekey, 'pkcs8')

// 公钥加密
var NodeRSA1 = require('node-rsa')
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6NbLptKyVTTGvIFm7MSFN5k4Z
EaTwvfxIGLrs0Sy40wXdY+55M4Y1Jbs/F70yLShjYee9u41OmFidA+E0QoMQBbco
dm4+iUV/WsVw/sGAmTAdRY9oYm5abaKrUST90j/S0+QUOVDMSvxubIHtY66KW5sV
M+nYhkQUjuBHdV97uwIDAQAB
-----END PUBLIC KEY-----`
const key1 = new NodeRSA1(publicKey);
key1.setOptions({ encryptionScheme: 'pkcs1' })
// key1.importKey(publicKey, 'pkcs8')
@Injectable()
export class CommonService {
    public client;

    constructor(
        private redisService: RedisService,
    ) {
        this.getClient();
    }
    async getClient() {
        this.client = await this.redisService.getClient()
    }

    //设置值的方法
    async set(key: string, value: any, seconds?: number) {
        value = JSON.stringify(value);
        if (!this.client) {
            await this.getClient();
        }
        if (!seconds) {
            await this.client.set(key, value);
        } else {
            await this.client.set(key, value, 'EX', seconds);
        }
    }

    //获取值的方法
    async get(key: string) {
        if (!this.client) {
            await this.getClient();
        }
        var data = await this.client.get(key);
        if (!data) return;
        return JSON.parse(data);
    }

    // 解密
    decrypt(data) {
        let strArr = data.split(':') //分段解码
        let BaseStr = '' //base64
        strArr.forEach(item => {
            BaseStr += key.decrypt(item, 'utf8');
        })
        let userDetail = JSON.parse(BaseStr) //解析成js对象
        return userDetail
    }

    // 加密
    async encrypt(data) {
        return await key1.encrypt(data, 'base64')
    }

}
