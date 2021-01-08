/*
 * @Author: your name
 * @Date: 2021-01-07 18:08:51
 * @LastEditTime: 2021-01-08 18:05:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\common\common.service.ts
 */
import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
var nodeRsa = require('node-rsa')
const privatekey = `-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMM+i/5G7/gFgxbn
OefntlREuYyg3VamF8M6Ii8JxAB+If3bvoDG/OFDpE+YI7r4rI1mXIKpCXngAtxn
e0bHGKxjVDEEnibvPrccMUqMe+ouTtRoSmrIPjPneuAWvCdco+K3KwyyC8xTAGtt
lcMos2es5zGdZVoMseuLF9eGSoHFAgMBAAECgYAtQZdDln/TNrvfGDPU7GHYAKId
1b/YcOF7MENyMcpL7vDEHiZ3RSiisoIorPRDR5b/o6V35+S5alJfcmEh086E5qUW
TsZ+HCbwNsG/FTac0GnjuvnfqW3zj1/ZgUCUUnDzGaF3kTyTtJ1bO6BT8V82+3/Y
YO236DVUfLZwDGKtQQJBAPpzKdE+1DwyRwWdmyhrpUP+w5THG8sdVT33l+W3j/Pt
TZxWbnufqEe1WA85bFDMSSnWHM6hFJS5RC4SP+amZXECQQDHkjHjqlVm17fmahAs
Th2qlUqqMsL+UIcTjlsZCTdRb5ejwtGiHyUEr6sWlAaZS28E6jjxPpHX8J7V4uGK
MWeVAkEAqD3etJLJTdrUfQA/76pIbeHhjrsmf46n6aW+o3FpQYqDHWeudlttVyaK
Dkgb7DcfWvxbg68PvUyrcWuPA6l58QJAb7V5j4Isw6BEJAmCfApNuMpQPOylEU1q
DpxEicMK396i9tt6FFFymyjpj33UI8KBpjKlJQRtBn59qiORM5Vr8QJBAPEAZrrx
7cx2JdvC79iwDtttQmicxv4lhpSedVlxX3ZbgdoYOmCXdwx/R+Qcp/dEZ4pZcizc
dyq0eKAL1CUux9I=
-----END PRIVATE KEY-----`
const nodersa = new nodeRsa(privatekey)
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

    decrypt(data) {
        // let userStr = window.atob(data) //加密字符串base64
        // let strArr = userStr.split(':') //分段解码
        // let BaseStr = '' //base64
        // strArr.forEach(item => {
        //     BaseStr += nodersa.decrypt(item, 'utf8');
        // })
        // let userDetail = JSON.parse(window.atob(BaseStr)) //解析成js对象
        let userDetail = nodersa.decrypt(data, 'utf8');
        console.log(userDetail)
    }

}
