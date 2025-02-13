import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the product',
    example: 'Bigo live',
  })
  title: string;

  @IsString()
  @IsUrl()
  @ApiProperty({
    description: 'Product image',
    example: 'http://productimg.com',
  })
  image: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product description',
    example: 'The best live plataform of your life',
  })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Base price',
    example: 9.99,
  })
  price: number;
}

