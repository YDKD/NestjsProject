// prod.config.ts
import { resolve } from 'path'

export default {
  port: 3210,

  orm: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'test',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    dropSchema: false,
    synchronize: false,
    logging: false,
  },
}
