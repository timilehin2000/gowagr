import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.jwt_secret,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, username: payload.username };
  }
}
