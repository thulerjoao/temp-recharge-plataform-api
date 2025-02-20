import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/update-password.dto';
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
    return this.prisma.user.findMany({
      select: this.userSelect,
    });
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
    const data = {
      name: dto.name,
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
    };
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

  async generateVerificationCode(email: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('Email não cadastrado');
    }
    const code = Math.floor(10000 + Math.random() * 90000);
    await this.prisma.user.update({
      where: { email },
      data: { verificationCode: code },
    });
    return code;
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { email, code, password, confirmPassword } = dto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.verificationCode !== code) {
      throw new NotFoundException('Código inválido ou expirado');
    }

    if (password !== confirmPassword) {
      throw new NotFoundException('As senhas não conicidem');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        verificationCode: null,
      },
    });
    return { message: 'Senha atualizada com sucesso' };
  }
}
