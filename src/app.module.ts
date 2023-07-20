import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation/entities/conversation.entity';
import { Message } from './message/entities/message.entity';
import { UserModule } from './user/user.module';
import { OauthModule } from './oauth/oauth.module';
import { User } from './user/entities/user.entity';
import { Oauth } from './oauth/entities/oauth.entity';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MessageModule,
    ConversationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Thinh2001!',
      database: 'nestjs_training',
      entities: [Conversation, Message, User, Oauth],
      synchronize: true,
    }),
    UserModule,
    OauthModule,
    ConfigModule.forRoot(),
    CacheModule.register({
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
