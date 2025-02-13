import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  private productSelect = {
    id: true,
    image: true,
    title: true,
    description: true,
    price: true,
  };

  findAll() {
    return this.prisma.product.findMany({ select: this.productSelect });
  }

  async findOne(id: string) {
    const data = await this.prisma.product.findUnique({
      where: { id },
      select: this.productSelect,
    });
    if (!data) {
      throw new BadRequestException('Unavailable id');
    }
    return data;
  }

  async create(dto: CreateProductDto) {
    const data = { ...dto };
    return await this.prisma.product.create({
      data,
      select: this.productSelect,
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    const data = { ...dto };
    return await this.prisma.product.update({
      where: { id },
      data,
      select: this.productSelect,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
  }
}
