import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { AuthGuard } from 'src/oauth/auth.guard';
import { ListConversationDto } from './dto/list-conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createCon(@Body() data: CreateConversationDto, @Req() request) {
    const user_id = request.user.user_id;
    return await this.conversationService.createConversation(data, user_id);
  }

  @UseGuards(AuthGuard)
  @Post('list')
  async ListCon(@Param() data: ListConversationDto, @Req() request) {
    const user_id = request.user.user_id;
    return await this.conversationService.listConversation(data, user_id);
  }
}
