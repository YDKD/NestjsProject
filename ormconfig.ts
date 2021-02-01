let obj = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // entities: ["src/**/*.entity{.ts,.js}"],
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: false,
    autoLoadEntities: true,
}
if (process.env.NODE_ENV == 'development') {
    obj.host = process.env.DB_LOCAL_HOST
}
module.exports = obj

