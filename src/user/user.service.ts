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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
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
  async createUser(username, password, email, postCode) {
    if (postCode != this.send_code) {
      throw new BadRequestException('验证码错误')
    } else {
      const res = await this.userRepository.find({ select: ['user_id', 'passwd_salt'], where: { user_status: 1, role: 3 } })
      let currLastUser = jsonParse(res)
      let currUserId = currLastUser[currLastUser.length - 1].user_id + 1
      let salt = currLastUser[currLastUser.length - 1].passwd_salt
      let hashPassword = encryptPassword(password, salt)
      const result = await this.userRepository.query(`INSERT INTO user_entity (user_id, username, password, email) VALUES(${currUserId},'${username}', '${hashPassword}', '${email}')`)
      return result
    }
  }

  async sendEmail(addressee) {
    let sendCode = verifyCode()
    this.send_code = sendCode
    console.log(this.send_code)
    return this.mailerService.sendMail({
      to: addressee,
      subject: "Foss-Store注册校验码",
      html: `<h1>欢迎注册Foss-Store系统，您本次的注册验证码为：${sendCode}</h1>`,
    }).then((res) => {
      return {
        sendCode: sendCode,
        status: 200
      }
    }).catch((error) => {
      return {
        status: 201
      }
    })
  }
}
