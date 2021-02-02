/*
 * @Author: your name
 * @Date: 2020-12-29 12:07:14
 * @LastEditTime: 2021-01-05 14:10:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\entities\user.entity.ts
 */
import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from 'typeorm';

@Entity()
export class UserEntity {
  // 会以类名来创建表,如果是驼峰命名的,生成的表名是下划线区分
  @PrimaryGeneratedColumn({ comment: '主键id' })
  id: number;

  @Column({ type: 'int', comment: '用户id' })
  user_id: number;

  @Column({ type: 'varchar', comment: '用户姓名' })
  username: string;

  @Column({ type: 'varchar', comment: '密码' })
  password: string;

  @Column({ type: 'varchar', comment: '密码盐', default: 'dasd' })
  passwd_salt: string;

  @Column({ type: 'varchar', comment: '邮箱' })
  email: string;

  @Column({ type: 'tinyint', comment: '用户角色：0-超级管理员|1-管理员|2-开发&测试&运营|3-普通用户（只能查看）', default: 3 })
  role: number;

  @Column({ type: 'tinyint', comment: '状态：0-失效|1-有效|2-删除', default: 1 })
  user_status: number;


  @Column({ type: 'int', comment: '创建人ID', default: 67000 })
  create_by: number;


  @Column({ type: 'int', comment: '修改人ID', default: 67000 })
  update_by: number;

  @Column({ type: 'timestamp', default: () => 'current_timestamp', select: false, comment: '创建时间' })
  create_time: Timestamp;

  @Column({ type: 'varchar', default: '', comment: '用户登录地址' })
  user_login_place: string

  @Column({
    type: 'timestamp',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp',
    select: false,
    comment: '修改时间'
  })
  update_time: Timestamp;

  @Column({
    type: 'varchar',
    default: '',
    comment: '用户路由列表'
  })
  auth: string
}
