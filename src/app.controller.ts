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
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: any, @Res() res: Response) {
    const { access_token } = await this.authService.login(req.user);
    return res.status(HttpStatus.OK).json({
      success: true,
      data: { access_token },
    });
  }

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
