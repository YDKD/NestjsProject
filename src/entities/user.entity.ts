import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from 'typeorm';

@Entity()
export class UserEntity {
  // 会以类名来创建表,如果是驼峰命名的,生成的表名是下划线区分
  @PrimaryGeneratedColumn({ comment: '主键id' })
  id: number;

  @Column({ type: 'smallint', comment: '用户id' })
  user_id: number;

  @Column({ type: 'varchar', comment: '用户账号' })
  username: string;

  @Column({ type: 'varchar', comment: '真实姓名' })
  real_name: string;

  @Column({ type: 'varchar', comment: '密码' })
  password: string;

  @Column({ type: 'varchar', comment: '密码盐' })
  passwd_salt: string;

  @Column({ type: 'varchar', comment: '手机号' })
  mobile: string;

  @Column({ type: 'tinyint', comment: '用户角色：0-超级管理员|1-管理员|2-开发&测试&运营|3-普通用户（只能查看）' })
  role: number;

  @Column({ type: 'tinyint', comment: '状态：0-失效|1-有效|2-删除' })
  user_status: number;


  @Column({ type: 'smallint', comment: '创建人ID' })
  create_by: number;


  @Column({ type: 'smallint', comment: '修改人ID' })
  update_by: number;

  @Column({ type: 'timestamp', default: () => 'current_timestamp', select: false, comment: '创建时间' })
  create_time: Timestamp;

  @Column({
    type: 'timestamp',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp',
    select: false,
    comment: '修改时间'
  })
  update_time: Timestamp;
}
