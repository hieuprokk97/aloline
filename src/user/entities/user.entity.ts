import { Message } from 'src/message/entities/message.entity';
import { Oauth } from 'src/oauth/entities/oauth.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  user_id: string;

  @Column({
    default: '',
    type: 'text',
  })
  avatar: string;

  @Column({
    default: '',
    type: 'varchar',
  })
  name: string;

  @Column({
    default: '',
    type: 'text',
  })
  street: string;

  @Column({
    default: '',
    type: 'text',
  })
  lat: string;

  @Column({
    default: '',
    type: 'text',
  })
  lng: string;

  @Column({
    default: 0,
    type: 'int',
  })
  country_id: number;

  @Column({
    default: 0,
    type: 'int',
  })
  city_id: number;

  @Column({
    default: 0,
    type: 'int',
  })
  district_id: number;

  @Column({
    default: 0,
    type: 'int',
  })
  ward_id: number;

  @Column({
    default: '',
    type: 'varchar',
  })
  phone: string;

  @Column({
    default: '',
    type: 'varchar',
  })
  gender: string;

  @Column({
    default: '',
    type: 'text',
  })
  birthday: string;

  @Column({
    type: 'text',
  })
  username: string;

  @Column({
    type: 'text',
  })
  password: string;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  timestamp: string;

  @Column({
    default: false,
  })
  is_online: boolean;

  @OneToMany(() => Oauth, (oauth) => oauth.oauth)
  user_oauth: User[];

  @OneToMany(() => Message, (message) => message.message_user)
  user_message: User[];
}
