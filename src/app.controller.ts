import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { LoginDto } from './auth/dto/login.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('default')
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
