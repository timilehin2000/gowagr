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

  /**
   * Validates the user's credentials.
   *
   * @param {string} username - The username of the user attempting to log in.
   * @param {string} pass - The plain text password of the user.
   * @returns {Promise<any>} - The user details if the credentials are valid, otherwise null.
   */

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

  /**
   * Generates a JWT for the authenticated user with the id and username signed into it.
   *
   * @param {any} user - The authenticated user object containing the username and id.
   * @returns {Promise<{ access_token: string }>} - An object containing the signed JWT access token.
   */

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
