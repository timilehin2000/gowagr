import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user =
      await this.userService.findUserWithPasswordByUsername(username);
    if (user) {
      const result = await bcrypt.compare(pass, user.password);
      if (result) {
        return await this.userService.getUserDetails(username);
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, id: user.id };

    const access_token = this.jwtService.sign(payload, {
      secret: jwtConstants.jwt_secret,
      expiresIn: '24h',
    });

    return {
      access_token,
    };
  }
}
