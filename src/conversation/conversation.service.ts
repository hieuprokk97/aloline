import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { ListConversationDto } from './dto/list-conversation.dto';
import { ListConversationResponse } from './response/list-conversation.response';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createConversation(data: CreateConversationDto, user_id: string) {
    try {
      const dataUser: number[] = data.member;
      //Kiểm tra User có bị trùng hay không
      let isUserExist = true;
      dataUser.forEach((userid) => {
        if (userid === +user_id) {
          isUserExist = false;
        }
      });
      if (isUserExist) dataUser.push(+user_id);
      //Kiểm tra các user được thêm vào có tồn tại hay không
      let isExist = true;
      const userExist = await this.userRepository.find({
        select: {
          user_id: true,
        },
      });
      dataUser.forEach((user_id) => {
        if (!userExist.some((user) => +user.user_id === user_id)) {
          isExist = false;
        }
      });
      if (!isExist)
        throw new HttpException(
          'Có User không tồn tại',
          HttpStatus.BAD_GATEWAY,
        );

      const conversationExist = await this.conversationRepository
        .createQueryBuilder('con')
        .where('con.members @> ARRAY[:...dataUser]::integer[]', { dataUser })
        .getOne();

      if (conversationExist) {
        throw new HttpException('Con Tồn tại', HttpStatus.BAD_REQUEST);
      } else {
        const createConversation = await this.conversationRepository.create({
          members: data.member,
        });
        await this.conversationRepository.insert(createConversation);
        throw new HttpException('Thêm thành công', HttpStatus.OK);
      }
    } catch (e) {
      console.log(e);
    }
  }
  async listConversation(data: ListConversationDto, user_id: string) {
    try {
      const limit = +data.limit || 20;

      console.log(user_id);
      const listCon = await this.conversationRepository
        .createQueryBuilder('con')
        .where(':id = ANY (con.members)', { id: +user_id })
        .take(limit)
        .getMany();
      console.log(listCon);

      return ListConversationResponse.mapToList(listCon);
    } catch (error) {
      throw new HttpException('Không có list nào', HttpStatus.BAD_REQUEST);
    }
  }
}
