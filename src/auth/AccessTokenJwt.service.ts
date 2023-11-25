import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenJwtService {
  constructor(private jwtService: JwtService) {}

  async generate(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: '5m',
    });
  }

  async verify<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, {
      secret: jwtConstants.accessTokenSecret,
    });
  }
}
