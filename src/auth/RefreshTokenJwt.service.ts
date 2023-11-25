import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenJwtService {
  constructor(private jwtService: JwtService) {}

  async generate(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: '1d',
    });
  }

  async verify<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, {
      secret: jwtConstants.refreshTokenSecret,
    });
  }
}
