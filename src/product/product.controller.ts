import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products',
  })
  findAll() {
    return this.productService.findAll();
  }
  
  @Get(':id')
  @ApiOperation({
    summary: 'Get product by id',
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
  
  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new product',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Updating product by id',
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete product by id',
  })
  remove(@Param('id') id: string) {
    return this.productService.delete(id);
  }

  // @Post('product-image')
  // @ApiOperation({
  //   summary: 'insert product image',
  // })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       imageUrl: {
  //         type: 'string',
  //         format: 'url',
  //       },
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5000000 } }))
  // async insertProductImage(
  //   @Body('imageUrl') imageUrl: string,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<ProductImageResponse> {
  //   return await this.productService.insertProductPicture(imageUrl, file);
  // }
}
