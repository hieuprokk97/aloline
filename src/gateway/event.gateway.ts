import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { jwtConstants } from 'src/oauth/oauth.constrant';
import { User } from 'src/user/entities/user.entity';
import { Any, In, Repository } from 'typeorm';

@WebSocketGateway()
export class MyGateWay implements OnGatewayConnection {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private jwtService: JwtService,
  ) {}
  @WebSocketServer()
  server: Server;
  private readonly sockets = new Map<string, Socket>();

  checkToken(token: string) {
    if (!token)
      throw new HttpException('Không có token', HttpStatus.BAD_REQUEST);
    const payload = this.jwtService.verify(token.toString(), {
      secret: jwtConstants.secret,
    });
    return payload;
  }

  addSocket(user_id: string, socket: Socket): void {
    this.sockets.set(user_id, socket);
  }
  removeSocket(user_id: string): void {
    this.sockets.delete(user_id);
  }

  //#region check Connection
  async handleConnection(socket: Socket) {
    try {
      const payload = this.checkToken(
        socket.handshake.headers.authentication.toString(),
      );
      try {
        await this.userRepository.update(
          { user_id: payload['user_id'] },
          { is_online: true },
        );
        const user = await this.userRepository.findOne({
          select: { user_id: true },
          where: { user_id: payload['user_id'] },
        });
        this.addSocket(user.user_id, socket);
      } catch (error) {
        socket.disconnect();
      }
    } catch (e) {
      console.log(e);
    }
  }
  async handleDisconnect(socket: Socket) {
    const payload = this.checkToken(
      socket.handshake.headers.authentication.toString(),
    );
    try {
      await this.userRepository.update(
        { user_id: payload['user_id'] },
        { is_online: false },
      );
      const user = await this.userRepository.findOne({
        select: { user_id: true },
        where: { user_id: payload['user_id'] },
      });
      this.removeSocket(user.user_id);
    } catch (error) {
      socket.disconnect();
    }
  }
  //#endregion

  //#region Room
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(socket: Socket, room: string) {
    const payload = this.checkToken(
      socket.handshake.headers.authentication.toString(),
    );
    const con = await this.conversationRepository.findOne({
      select: { members: true },
      where: { conversation_id: room },
    });
    if (!con)
      throw new HttpException('Phòng không tồn tại', HttpStatus.BAD_REQUEST);
    const check = con.members.includes(+payload['user_id']);
    if (!check)
      throw new HttpException(
        'Người dùng không nằm trong cuộc trò chuyện này',
        HttpStatus.BAD_REQUEST,
      );
    socket.join(room);
    this.server.to(room).emit('joinRoom', room);
    console.log(socket.rooms);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    const inRoom = client.rooms.has(room);
    if (!inRoom)
      throw new HttpException(
        'User không nằm trong Room đó',
        HttpStatus.BAD_REQUEST,
      );
    else {
      client.leave(room);
      console.log(`Client ${client.id} đã rời khỏi room ${room}`);
    }
  }
  //#endregion

  isUserInRoom(user_id: string, room_id: string): boolean {
    const room = this.server.sockets.adapter.rooms.get(room_id);
    if (!room) {
      return false;
    }
    return Array.from(room).some((socketId: string) => {
      const socket = this.server.sockets.sockets.get(socketId);
      return socket && socket.data.user.id === user_id;
    });
  }

  @SubscribeMessage('newMessage')
  async handleConMessage(
    @MessageBody() data: { conversation_id: string; message: string },
  ) {
    try {
      const checkConExist = await this.conversationRepository.findOne({
        where: {
          conversation_id: data.conversation_id,
        },
      });
      console.log(checkConExist);
      if (!checkConExist)
        throw new HttpException('Phòng không tồn tại', HttpStatus.BAD_REQUEST);
      this.server
        .to(checkConExist.conversation_id)
        .emit('newMessage', data.message);
    } catch (error) {
      console.log(error);
    }
  }

  //#region typing

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { room: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.to(data.room).emit('typing', socket.id);
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @MessageBody() data: { room: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.to(data.room).emit('stopTyping', socket.id);
  }

  //#endregion
}
