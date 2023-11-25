import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AccessTokenJwtService } from './AccessTokenJwt.service';
import { RefreshTokenJwtService } from './RefreshTokenJwt.service';
import { IsNumber, IsString, validate } from 'class-validator';

class RefreshTokenUser {
  @IsNumber()
  sub: number;
  @IsString()
  email: string;
  @IsString()
  password: string;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private accessTokenJwtService: AccessTokenJwtService,
    private refreshTokenJwtService: RefreshTokenJwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.accessTokenJwtService.generate(payload),
      refresh_token: await this.refreshTokenJwtService.generate(payload),
    };
  }

  async refresh(refreshToken: string) {
    const userInfo =
      await this.refreshTokenJwtService.verify<RefreshTokenUser>(refreshToken);

    const validationErrors = await validate(userInfo);
    if (validationErrors.length > 0) {
      throw new UnauthorizedException();
    }

    const payload = { sub: userInfo.sub, email: userInfo.email };
    return {
      access_token: await this.accessTokenJwtService.generate(payload),
    };
  }
}
