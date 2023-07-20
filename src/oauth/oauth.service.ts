import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Oauth } from './entities/oauth.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OauthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Oauth)
    private readonly oauthRepository: Repository<Oauth>,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}
  async createToken(data: LoginUserDto) {
    const userInDb = await this.userRepository.findOne({
      where: {
        username: data.username,
      },
    });
    if (userInDb)
      throw new HttpException('User đã tồn tại', HttpStatus.BAD_REQUEST);
    const saveUser = await this.userRepository.create(data);
    await this.userRepository.save(saveUser);
    const user = await this.usersService.findByUsername(data.username);
    const payload = { user_id: user.user_id, username: user.username };
    const saveToken = await this.oauthRepository.create({
      access_token: await this.jwtService.signAsync(payload),
      user_id: user.user_id,
      status: 1,
    });
    await this.oauthRepository.save(saveToken);
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
