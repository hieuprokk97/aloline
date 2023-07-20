import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './oauth.constrant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth } from './entities/oauth.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Oauth]),
    TypeOrmModule.forFeature([User]),
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [OauthController],
  providers: [OauthService],
  exports: [OauthService],
})
export class OauthModule {}
