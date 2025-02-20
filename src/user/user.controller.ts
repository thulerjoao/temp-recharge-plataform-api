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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ResetPasswordDto } from './dto/update-password.dto';
import { RequestCodeDto } from 'src/user/dto/request-code.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user by id',
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new user',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Updating user by id',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user by id',
  })
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Post('request-code')
  async requestCode(@Body() requestCodeDto: RequestCodeDto) {
    const { email } = requestCodeDto;
    const code = await this.userService.generateVerificationCode(email);
    return { email, code };
  }

  @Post('update-by-code')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }
}
