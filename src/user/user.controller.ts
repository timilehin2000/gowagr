import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(@Inject() private userService: UserService) {}

  /**
   * POST: Registers a new user.
   *
   * @param {CreateUserDto} createUserDto - Data Transfer Object containing user details.
   * @param {Response} res - The response object used to send the HTTP response.
   *
   * @returns {Promise<any>} - A promise that resolves with the response containing the user details.
   */

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

  /**
   * GET: Retrieve the details of a user by username.
   *
   * @param {string} username - The username passed as a query parameter.
   * @param {Response} res - The response object used to send the HTTP response.
   * @returns {Promise<any>} Returns the user's details.
   */

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserDetails(
    @Query('username') username: string,
    @Res() res: Response,
  ): Promise<any> {
    if (!username) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Username missing in request!',
      });
    }
    const user = await this.userService.getUserDetails(username);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'User details retrieved successfully!',
      data: user,
    });
  }

  /**
   * GET: Retrieve the details and balance of a user by user id.
   *
   * @param {string} id - The userId passed as a path parameter.
   * @param {Response} res - The response object used to send the HTTP response.
   * @returns {Promise<any>} Returns the user's details.
   */

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUserWithBalance(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<any> {
    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Id missing in request!',
      });
    }
    const user = await this.userService.getUserWithBalance(id);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'User details retrieved successfully!',
      data: user,
    });
  }
}
