import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/oauth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { GatewayModule } from 'src/gateway/gateway.module';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    GatewayModule,
    CacheModule.register(),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
