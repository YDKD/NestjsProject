import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from 'typeorm';

@Entity()
export class User {
  // 会以类名来创建表,如果是驼峰命名的,生成的表名是下划线区分
  @PrimaryGeneratedColumn({ comment: '主键id' })
  id: number;

  @Column({ length: 50, comment: '名字' })
  name: string;

  @Column({ length: 50, comment: '性别' })
  sex: string;

  @Column({ comment: '年龄' })
  age: number;

  @Column({
    type: 'int',
    comment: '权限',
    // nullable: true,
    default: 4,
  })
  role: number;


  @Column({ type: 'timestamp', default: () => 'current_timestamp', select: false })
  createAt: Timestamp;

  @Column({
    type: 'timestamp',
    onUpdate: 'current_timestamp',
    default: () => 'current_timestamp',
    select: false
  })
  updateAt: Timestamp;
}
