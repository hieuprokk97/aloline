import { Controller, Post, Body, UseGuards, Req, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/oauth/auth.guard';
import { DistanceUserDto } from './dto/distance-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Post('distance')
  async calDistance(@Body() data: DistanceUserDto, @Req() request) {
    const user_id = request.user.user_id;
    return await this.userService.calculateDistance(data, user_id);
  }
}
