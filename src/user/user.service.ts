import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private userSelect = {
    id: true,
    name: true,
    email: true,
    password: false,
    createdAt: false,
    updatedAt: false,
  };

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const data = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });
    if (!data) {
      throw new BadRequestException('Unavailable id');
    }
    return data;
  }

  async create(dto: CreateUserDto): Promise<User> {
    if (dto.confirmPassword !== dto.password) {
      throw new BadRequestException(`Passwords do not march`);
    }
    const { confirmPassword, ...data } = dto;
    return await this.prisma.user.create({
      data,
      select: this.userSelect,
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    const { confirmPassword, ...data } = dto;
    return await this.prisma.user.update({
      where: { id },
      data,
      select: this.userSelect,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
  }
}
