import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { OauthService } from './oauth.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Post('register')
  async login(@Body() data: LoginUserDto) {
    return await this.oauthService.createToken(data);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user.user_id;
  }
}
