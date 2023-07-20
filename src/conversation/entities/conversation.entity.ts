import { Message } from 'src/message/entities/message.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  conversation_id: string;

  @Column({
    default: '',
  })
  name: string;

  @Column({
    default: '',
  })
  avater: string;

  @Column({
    type: 'bigint',
    default: 0,
  })
  last_message_id: string;

  @Column({
    default: 0,
  })
  type: number;

  @Column('int', {
    array: true,
  })
  members: number[];

  @Column({
    default: '',
  })
  background: string;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  last_activity: string;

  @Column({
    default: 0,
  })
  status: number;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  timestamp: string;

  @OneToMany(() => Message, (message) => message.conversation_message)
  @JoinColumn({ name: 'conversation_id' })
  messages: Message[];
}
