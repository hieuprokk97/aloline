import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DistanceUserDto {
  @IsNotEmpty()
  lat: string;

  @IsNotEmpty()
  lng: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  distance: number;

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
}
