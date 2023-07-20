import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Oauth {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: string;

  @Column({
    type: 'bigint',
  })
  user_id: string;

  @Column({
    type: 'text',
  })
  access_token: string;

  @Column({
    type: 'int',
  })
  status: number;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  timestamp: string;

  @ManyToOne(() => User, (user) => user.user_oauth)
  @JoinColumn({ name: 'user_id' })
  oauth = Oauth;
}
