import { Column, Entity, PrimaryColumn, Timestamp } from "typeorm";

@Entity()
export class iphone {
    @PrimaryColumn({ comment: '主键id' })
    id: number;

    @Column({ type: 'varchar', comment: '商品标题' })
    views_title: string;
    @Column({ type: 'varchar', comment: '商品ID' })
    commit_id: string;
    @Column({ type: 'varchar', comment: '图片地址' })
    img_pat: string;
    @Column({ type: 'decimal', comment: '商品价格' })
    views_price: string;
    @Column({ type: 'int', comment: '运费' })
    view_fee: string;
    @Column({ type: 'varchar', comment: '发货省份' })
    province: string;
    @Column({ type: 'varchar', comment: '发货城市' })
    city: string;
    @Column({ type: 'varchar', comment: '收获人数' })
    views_sales: string;
    @Column({ type: 'varchar', comment: '评论人数' })
    comment_count: string;
    @Column({ type: 'varchar', comment: '店铺名称' })
    shop_name: string;
    @Column({ type: 'varchar', comment: '店铺地址' })
    detail_url: string;
    @Column({ type: 'varchar', comment: '评论地址' })
    comment_url: string;
    @Column({ type: 'varchar', comment: '商品链接' })
    shop_link: string;
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
