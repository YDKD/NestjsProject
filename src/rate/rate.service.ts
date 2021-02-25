import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { jsonParse } from 'src/utils/json';
import { Repository } from 'typeorm';

@Injectable()
export class RateService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly userService: UserService
    ) { }

    async comparePriceSection(section: number, user_id) {
        let checkTable = await this.userService.getUserConfigCheck(user_id)
        let section_time: any
        let sql: string
        let max = await this.userRepository.query(`SELECT MAX(views_price) FROM ${checkTable}`)
        let curr1,
            curr2
        let pending2: boolean
        max = jsonParse(max)[0]['MAX(views_price)']
        max = parseInt(max)
        // max = 900
        // section = 50
        section_time = (max - max % section) / section
        sql = `select `

        if (section < 100) {
            for (let i = 0; i <= section_time; i++) {
                if (section * i < 200) {
                    sql += `count(case when views_price BETWEEN ${section * i} AND ${section * (i + 1)} THEN ${i + 1} END) as '${section * i}-${section * (i + 1)}',`
                    curr1 = i + 1
                } else {
                    pending2 = true
                }
            }
        }
        if (pending2) {
            max -= 200
            for (let i = 1; i <= (max - max % 100) / 100; i++) {
                if (100 * (i + 1) < 1000) {
                    sql += `count(case when views_price BETWEEN ${100 * (i + 1)} AND ${100 * (i + 2)} THEN ${i + curr1} END) as '${100 * (i + 1)}-${100 * (i + 2)}',`
                    curr2 = i + curr1
                }
            }
        }
        if (max > 1000) {
            console.log(456)
            max -= 1000
            for (let i = 0; i <= (max - max % 1000) / 500; i++) {
                let start = 1000 + i * 500
                let end = 1000 + 500 * (i + 1)
                sql += `count(case when views_price BETWEEN ${start} AND ${end} THEN ${curr2} END) as '${start}-${end}',`
            }
        }


        sql = sql.substr(0, sql.length - 1)
        sql += ` FROM ${checkTable}`
        let res = await this.userRepository.query(sql)
        return res
    }

}
