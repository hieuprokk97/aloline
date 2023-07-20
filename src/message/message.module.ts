import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { AuthGuard } from 'src/oauth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Conversation } from 'src/conversation/entities/conversation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([Conversation]),
  ],
  controllers: [MessageController],
  providers: [MessageService, AuthGuard, JwtService],
})
export class MessageModule {}
