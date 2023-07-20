import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ListConversationDto {
  @IsNotEmpty()
  @ApiProperty({
    default: '20',
    description: 'Số story muốn lấy',
  })
  limit: string;

  @ApiProperty({
    default: '',
    description: 'Truyền lên position cuối cùng của mảng trước đó',
  })
  position: string;

  @ApiProperty()
  members: [];
}
