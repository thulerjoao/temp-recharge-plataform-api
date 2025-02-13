import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private authUser = {
    id: true,
    name: true,
    email: true,
    password: true,
    createdAt: false,
    updatedAt: false,
  };

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { password, email } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: this.authUser,
    });
    if (!user) {
      throw new UnauthorizedException('User or password invalid');
    }
    const isHashValid = await bcrypt.compare(password, user.password);
    if(!isHashValid){
        throw new UnauthorizedException('User or password invalid');
    }

    const data = {
        name: user.name,
        email: user.email,
    }

    return {
        token: this.jwtService.sign({email}),
        user: data
    }

  }
}
