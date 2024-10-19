import {
  Controller,
  Get,
  Res,
  Request,
  UseGuards,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { Response } from 'express';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  /**
   * Handles the login request by authenticating the user using the LocalAuthGuard.
   *
   * @param {Request} req - The incoming request object containing user details.
   * @param {Response} res - The response object used to send the access token.
   * @returns {Promise<Response>} - A promise that resolves to a JSON response containing the access token.
   */

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: any, @Res() res: Response) {
    const { access_token } = await this.authService.login(req.user);
    return res.status(HttpStatus.OK).json({
      success: true,
      data: { access_token },
    });
  }

  /**
   * Handles the logout request by removing the 'Authorization' header and responding with a success message.
   *
   * @param {Response} res - The response object used to send the success message.
   * @returns {Promise<Response>} - A promise that resolves to a JSON response confirming successful logout.
   */

  @UseGuards(JwtAuthGuard)
  @Get('auth/logout')
  async logout(@Res() res: Response) {
    res.removeHeader('Authorization');
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
