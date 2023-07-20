import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { OauthModule } from 'src/oauth/oauth.module';
import { AuthGuard } from 'src/oauth/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    OauthModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ConversationController],
  providers: [ConversationService, AuthGuard, JwtService],
})
export class ConversationModule {}
