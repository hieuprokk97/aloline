import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DistanceUserDto } from './dto/distance-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(data: CreateUserDto) {
    try {
      // data.password = await bcrypt.hash(data.password, 10);
      const userInDb = await this.userRepository.findOne({
        where: {
          username: data.username,
        },
      });
      if (userInDb)
        throw new HttpException('User đã tồn tại', HttpStatus.BAD_REQUEST);
      const saveUser = await this.userRepository.create(data);
      await this.userRepository.save(saveUser);
    } catch (error) {
      console.log(error);
    }
  }
  async checkExistUser(username: string) {
    try {
      const checkUser = await this.userRepository.findOne({
        where: {
          username: username,
        },
      });
      if (!checkUser) {
        throw new HttpException('User chưa tồn tại', HttpStatus.BAD_REQUEST);
      }
      return checkUser;
    } catch (error) {
      console.log(error);
    }
  }
  async findByUsername(username: string) {
    try {
      const user = await this.checkExistUser(username);
      if (!user)
        throw new HttpException('User chưa tồn tại', HttpStatus.BAD_REQUEST);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  public async calculateDistance(data: DistanceUserDto, user_id: string) {
    try {
      const disAll = await this.userRepository.find({
        select: {
          user_id: true,
          lat: true,
          lng: true,
        },
      });
      const disUser = await this.userRepository.findOne({
        select: {
          lat: true,
          lng: true,
        },
        where: {
          user_id: user_id,
        },
      });
      const limit = +data.limit || 20;
      let i = 0;
      const dis = [];
      for (const index in disAll) {
        const distance = Math.sqrt(
          Math.pow(+disUser.lat - +disAll[index].lat, 2) +
            Math.pow(+disUser.lng - +disAll[index].lng, 2),
        );
        if (distance !== 0 && i < limit && distance < data.distance) {
          dis.push(disAll[index].user_id);
          i += 1;
        }
        try {
          await this.cacheManager.set(index, distance);
        } catch (error) {
          console.error('Error in set operation in Redis:', error);
        }
      }
      const listUser: UserDis[] = [];
      for (const index of dis) {
        const user = await this.userRepository.findOne({
          select: {
            username: true,
            user_id: true,
            lat: true,
            lng: true,
          },
          where: {
            user_id: index,
          },
        });
        listUser.push();
        if (user) {
          listUser.push(user);
        }
      }
      return listUser;
    } catch (error) {
      console.log(error);
    }
  }
}
export interface UserDis {
  username: string;
  user_id: string;
  lat: string;
  lng: string;
}
