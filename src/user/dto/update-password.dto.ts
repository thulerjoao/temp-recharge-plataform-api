import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    example: 'email@email.com',
  })
  email: string;

  @IsInt()
  @Min(10000)
  @Max(99999)
  @ApiProperty({
    description: 'Código de 5 dígitos',
    example: 12345,
  })
  code: number;

  @MinLength(6)
  @ApiProperty({
    description: 'Nova senha',
    example: 'Abcd@12344',
  })
  password: string;

  @MinLength(6)
  @ApiProperty({
    description: 'Nova senha',
    example: 'Abcd@12344',
  })
  confirmPassword: string;
}
