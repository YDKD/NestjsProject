/*
 * @Author: your name
 * @Date: 2021-01-04 11:46:58
 * @LastEditTime: 2021-01-09 15:36:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\user\user.service.ts
 */
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { UserEntity } from 'src/entities/user.entity';
import { verifyCode } from 'src/utils';
import { encryptPassword } from 'src/utils/cryptogram';
import { jsonParse } from 'src/utils/json';
import { Repository } from 'typeorm';
import { codeOverdue } from 'src/utils';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
    private readonly commonService: CommonService
  ) {
  }
  send_code: string


  /**
   * @name: 根据用户名查询用户信息
   * @param {string} username
   * @return {*}
   */
  async findOneByName(username: string) {
    const result = await this.userRepository.query(`SELECT * FROM user_entity WHERE username = '${username}'`)
    const user = jsonParse(result)
    if (user) return user[0];
    else return null
  }

  /**
   * @name: 判断用户名是否已被注册
   * @param {*} username
   * @return 201 已被注册  200 没有注册
   */
  async usernameExist(username) {
    const result = await this.userRepository.findOne({ username })
    return result ? true : false;
  }

  async emailExist(email) {
    const result = await this.userRepository.findOne({ email })
    return result ? true : false;
  }

  /**
   * @name: 根据用户ID查询用户信息
   * @param {*} user_id
   * @return {*}
   */
  async findOneByUserId(user_id) {
    const result = await this.userRepository.find({ select: ['user_id', 'username', 'email'], where: { user_id: user_id } })
    // const result = await this.userRepository.query(`SELECT * FROM user_entity WHERE user_id = ${user_id}`)
    return result
  }

  /**
   * @name: 用户注册
   * @param {*} username
   * @param {*} password
   * @param {*} email
   * @return {*}
   */
  async createUser(data) {
    // 解密
    let { postCode, username, password, email } = await this.commonService.decrypt(data)
    let currUserId: number
    let salt = ''
    if (postCode.toLocaleLowerCase() == this.send_code.toLocaleLowerCase()) {
      const res = await this.userRepository.find({ select: ['user_id', 'passwd_salt'], where: { user_status: 1 } })
      let currLastUser = jsonParse(res)
      if (currLastUser) {
        currUserId = currLastUser[currLastUser.length - 1].user_id + 1
        salt = currLastUser[currLastUser.length - 1].passwd_salt
      } else {
        currUserId = 67100
        salt = 'dasd'
      }

      let hashPassword = encryptPassword(password, salt)
      const result = await this.userRepository.query(`INSERT INTO user_entity (user_id, username, password, email) VALUES(${currUserId},'${username}', '${hashPassword}', '${email}')`)
      return {
        code: 200,
        data: result
      }
    } else {
      return {
        code: 201
      }
    }
  }

  /**
   * @name: 发送邮箱验证码
   * @param {*} addressee
   * @return {*}
   */
  async sendEmail(addressee) {
    let sendCode = verifyCode()
    this.send_code = sendCode
    console.log(this.send_code)
    return this.mailerService.sendMail({
      to: addressee,
      subject: "Foss-Store注册校验码",
      html: `<h1>欢迎注册Foss-Store系统，您本次的注册验证码为：${sendCode}</h1>`,
    }).then((res) => {
      return 200
    }).catch((error) => {
      return 201
    })
  }


  async resetPassword(data) {
    // 解密
    let { postCode, password, email } = await this.commonService.decrypt(data)
    if (postCode.toLocaleLowerCase() == this.send_code.toLocaleLowerCase()) {
      // 获取用户
      let userInfo = await this.userRepository.find({ where: { email: email } })
      userInfo = jsonParse(userInfo)
      let newPassword = encryptPassword(password, userInfo[0].passwd_salt)
      let res = await this.userRepository.query(`UPDATE user_entity SET password = '${newPassword}' WHERE email = '${userInfo[0].email}'`)
      return {
        code: 200,
        data: res
      }
    } else {
      return {
        code: 201
      }
    }

  }
}
