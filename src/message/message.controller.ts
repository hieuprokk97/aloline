import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from 'src/oauth/auth.guard';
import { ListMessageDto } from './dto/list-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() createMessageDto: CreateMessageDto, @Req() request) {
    const user_id = request.user.user_id;
    return this.messageService.createMessage(createMessageDto, user_id);
  }

  @UseGuards(AuthGuard)
  @Post('list')
  listMessage(@Body() data: ListMessageDto, @Req() request) {
    const user_id = request.user.user_id;
    return this.messageService.listMessByCon(data, user_id);
  }
}
