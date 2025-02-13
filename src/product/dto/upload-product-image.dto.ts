import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadProductImageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product image',
    example: 'http://productimg.com',
  })
  productId: string;
}