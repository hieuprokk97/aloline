import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { ListMessageDto } from './dto/list-message.dto';
import { ListMessageByCon } from './response/list-mess.response';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}
  async createMessage(data: CreateMessageDto, user_id: string) {
    try {
      //Kiểm tra Con có tồn tại không
      await this.checkConExist(data.conversation_id.toString());
      const checkUserInCon = await this.conversationRepository.find({
        select: {
          members: true,
        },
        where: {
          conversation_id: data.conversation_id.toString(),
        },
      });
      //Kiểm tra người dùng có ở trong Conversation hay không
      console.log(user_id);
      let isUserInCon = false;
      for (const user of checkUserInCon) {
        if (user.members.includes(+user_id)) {
          isUserInCon = true;
          break;
        }
      }
      if (!isUserInCon)
        throw new HttpException(
          'User không tồn tại trong conversation',
          HttpStatus.BAD_REQUEST,
        );
      //Nếu có thì tạo message trong Conversation với user_id
      const createMes = await this.messageRepository.create({
        user_id: user_id,
        conversation_id: data.conversation_id.toString(),
        message: data.message,
        status: 1,
      });
      await this.messageRepository.insert(createMes);
      throw new HttpException('Thêm message thành công', HttpStatus.OK);
    } catch (error) {
      console.log(error);
    }
  }
  async checkConExist(con_id: string) {
    try {
      const checkConExist = await this.conversationRepository.findOne({
        where: {
          conversation_id: con_id,
        },
      });
      if (!checkConExist)
        throw new HttpException(
          'Conversation không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      return checkConExist;
    } catch (error) {
      console.log(error);
    }
  }
  async listMessByCon(data: ListMessageDto, user_id: string) {
    try {
      const where = await this.messageRepository.find({
        relations: {
          message_user: true,
        },
      });
      return ListMessageByCon.mapToList(where);
    } catch (error) {
      console.log(error);
    }
  }
}
