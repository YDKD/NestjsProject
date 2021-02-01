import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShopService } from './shop.service';

@Controller('shop')
@ApiTags('店铺')
export class ShopController {


}
