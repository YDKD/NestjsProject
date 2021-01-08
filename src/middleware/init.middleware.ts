import { BadRequestException, HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NOTFOUND } from 'dns';
import { AuthService } from 'src/auth/auth.service';
import { CommonService } from 'src/common/common.service';
const semver = require('semver')
@Injectable()
export class InitMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly commonService: CommonService
  ) { }
  async use(req: any, res: any, next: () => void) {
    console.log(123)
    // 未登录、请求头未携带token、token过期
    if (this.authService.access_token && req.headers.authorization && this.authService.exp > new Date().getTime()) {
      // 获取用户上传token
      let postToken = req.headers.authorization.split(' ')[1]
      // 解析token
      let decode: any = await this.authService.decode(postToken)
      // 获取token中的sub用户名
      let username = decode.payload.sub
      // 根据上传用户名在Redis进行查询
      let result: any = await this.commonService.get('zs').then(res => {
        return res
      })
      if (result) {
        next()
      } else {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
      }
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }
  }
}
