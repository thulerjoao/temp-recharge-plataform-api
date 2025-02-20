import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestCodeDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    example: 'email@email.com',
  })
  email: string;
}
