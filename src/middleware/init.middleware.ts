import { BadRequestException, HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NOTFOUND } from 'dns';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class InitMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
  ) { }
  use(req: any, res: any, next: () => void) {
    console.log(this.authService.exp)
    console.log(new Date().getTime())
    if (this.authService.access_token && this.authService.exp > new Date().getTime()) {
      next()
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }
  }
}
