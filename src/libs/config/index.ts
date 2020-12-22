// index.ts
import * as _ from 'lodash'
import { resolve } from 'path'

import productionConfig from './prod.config'

const isProd = process.env.NODE_ENV === 'production'

let config = {
    port: 3306,
    hostName: 'localhost',

    orm: {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
        // timezone: 'UTC',
        // charset: 'utf8mb4',
        // multipleStatements: true,
        // dropSchema: false,
        // logging: true,
    },
}

if (isProd) {
    config = _.merge(config, productionConfig)
}

export { config }
export default config
