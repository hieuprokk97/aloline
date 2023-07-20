import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  message_id: string;

  @Column({
    type: 'bigint',
  })
  conversation_id: string;

  @Column({
    type: 'bigint',
  })
  user_id: string;

  @Column({
    type: 'text',
  })
  message: string;

  @Column({
    default: 0,
  })
  status: number;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  timestamp: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation_message: Conversation;

  @ManyToOne(() => User, (user) => user.user_message)
  @JoinColumn({ name: 'user_id' })
  message_user: User;
}
