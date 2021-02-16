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
var axios = require('axios')
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
    const result = await this.userRepository.find({ select: ['user_id', 'username', 'email', 'choose_type'], where: { user_id: user_id } })
    // const result = await this.userRepository.query(`SELECT * FROM user_entity WHERE user_id = ${user_id}`)
    return jsonParse(result)[0]
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

  // 获取用户当前登录地址
  async getUserPlace(id, place, location) {
    return await this.userRepository.query(`UPDATE user_entity SET user_login_place = '${place}',location = '${location}' WHERE user_id = ${id}`)
  }

  /**
   * @name: 发送邮箱验证码
   * @param {*} addressee
   * @return {*}
   */
  async sendEmail(addressee) {
    let sendCode = verifyCode()
    this.send_code = sendCode
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


  /**
   * @param {type} data I am argument data. 
   */
  async fogetPassowrd(data) {
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

  /**
   * @param {type} user_id I am argument user_id. 
   */
  async getUserConfigCheck(user_id) {
    let res = await this.findOneByUserId(user_id)
    let choose_type = res.choose_type || ''
    let checkTable = choose_type.split(',')[2]
    return checkTable
  }

  /**
   * @param {type} data I am argument data. 
   */
  async resetUsername(data) {
    let { user_id, password, newname } = data
    let res = await this.userRepository.query(`SELECT * from user_entity WHERE user_id = ${user_id}`)
    res = jsonParse(res)
    let { passwd_salt } = res[0]
    if (encryptPassword(password, passwd_salt) != res[0].password) {
      return {
        code: 201,
        msg: '密码错误'
      }
    } else {
      let result = await this.userRepository.query(`UPDATE user_entity SET username = '${newname}' WHERE user_id = ${user_id}`)
      if (result.affectedRows != 1) {
        return {
          code: 201,
          msg: '用户名更新失败'
        }
      } else {
        return {
          code: 200,
          msg: '用户名更新成功'
        }
      }
    }
  }

  /**
   * @param {type} data I am argument data.
   * @description 重置密码 
   */
  async resetPassword(data) {
    let { user_id, newPassword, oldPassword } = data
    let res = await this.userRepository.query(`SELECT * from user_entity WHERE user_id = ${user_id}`)
    res = jsonParse(res)
    let { passwd_salt } = res[0]
    if (encryptPassword(oldPassword, passwd_salt) != res[0].password) {
      return {
        code: 201,
        msg: '原密码错误'
      }
    } else {
      let newPass = encryptPassword(newPassword, passwd_salt)
      let result = await this.userRepository.query(`UPDATE user_entity SET password = '${newPass}' WHERE user_id = ${user_id}`)
      if (result.affectedRows != 1) {
        return {
          code: 201,
          msg: '密码更新失败'
        }
      } else {
        return {
          code: 200,
          msg: '密码更新成功'
        }
      }
    }
  }

  /**
   * @param {type} data I am argument data. 
   * @description 验证邮箱
   */
  async validateEmail(data) {
    let { user_id, user_password, send_code } = data
    if (this.send_code.toLocaleLowerCase() == send_code.toLocaleLowerCase()) {
      let res = await this.userRepository.query(`SELECT * from user_entity WHERE user_id = ${user_id}`)
      res = jsonParse(res)
      let { password, passwd_salt } = res[0]
      if (encryptPassword(user_password, passwd_salt) != password) {
        return {
          code: 201,
          msg: '密码错误'
        }
      } else {
        return {
          code: 200,
          msg: '验证成功，请继续填写您的新邮箱'
        }
      }
    } else {
      return {
        code: 201,
        msg: '邮箱验证码错误'
      }
    }
  }

  async resetEmail(data) {
    let {user_id, send_code, new_email }  = data
    if(this.send_code.toLocaleLowerCase() == send_code.toLocaleLowerCase()) {
      let result = await this.userRepository.query(`UPDATE user_entity SET email = '${new_email}' WHERE user_id = ${user_id}`)
      if (result.affectedRows != 1) {
        return {
          code: 201,
          msg: '邮箱更新失败'
        }
      } else {
        return {
          code: 200,
          msg: '邮箱更新成功'
        }
      }
    } else {
      return {
        code: 201,
        msg: '邮箱验证码错误'
      }
    }
  }
}
