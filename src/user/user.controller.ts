import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(@Inject() private userService: UserService) {}

  @Post()
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<any> {
    const user = await this.userService.register(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'User created successfully!',
      data: user,
    });
  }
}
