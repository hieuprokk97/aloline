import { Module } from '@nestjs/common';
import { MyGateWay } from './event.gateway';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Conversation])],
  providers: [MyGateWay, JwtService],
})
export class GatewayModule {}
