import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './libs/common';

@Module({
  imports: [
    AuthModule,
    CommonModule,
    TypeOrmModule.forRoot()
    // TypeOrmModule.forRootAsync({
    //   useFactory() {
    //     let ormObj = {}
    //     if(process.env.NODE_ENV === 'production') {
    //       ormObj = {
    //         type: 'mysql',
    //         host: process.env.DB_HOST,
    //         port: Number(process.env.DB_PORT),
    //         username: process.env.DB_USERNAME,
    //         password: process.env.DB_PASSWORD,
    //         database: process.env.DB_DATABASE,
    //         entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //         synchronize: true,
    //         autoLoadEntities: true,
    //       }
    //     } else {
    //       ormObj = {
    //         type: 'mysql',
    //         host: process.env.DB_HOST,
    //         port: Number(process.env.DB_PORT),
    //         username: process.env.DB_USERNAME,
    //         password: process.env.DB_PASSWORD,
    //         database: process.env.DB_DATABASE,
    //         entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //         synchronize: true,
    //         autoLoadEntities: true,
    //       }
    //     }
    //     return ormObj
    //   }
    // })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
