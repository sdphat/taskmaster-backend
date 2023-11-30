import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import bcrypt, { compare } from 'bcrypt';
import { IsNumber, IsString, validate } from 'class-validator';
import { UsersService } from '../users/users.service';
import { AccessTokenJwtService } from './AccessTokenJwt.service';
import { RefreshTokenJwtService } from './RefreshTokenJwt.service';

class RegisterInfo {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;
}

class RefreshTokenUser {
  @IsNumber()
  sub: number;
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class UserPublicBriefInfo {
  fullName: string;
  email: string;
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

  async register(registerInfo: RegisterInfo) {
    const validationErrors = await validate(registerInfo);
    if (validationErrors.length > 0) {
      throw new BadRequestException();
    }

    if (await this.usersService.findOne(registerInfo.email)) {
      throw new ConflictException();
    }

    const createdUser: User = await this.usersService.create({
      ...registerInfo,
      password: await bcrypt.hash(
        registerInfo.password,
        +process.env.SALT_ROUNDS,
      ),
    });

    if (!createdUser) {
      throw new BadRequestException();
    }

    const payload = { sub: createdUser.id, email: createdUser.email };
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

  async getProfile(email: string): Promise<UserPublicBriefInfo> {
    const userInfo: UserPublicBriefInfo = await this.usersService.findOne(
      email,
      {
        email: true,
        fullName: true,
      },
    );

    if (!userInfo) {
      throw new UnauthorizedException();
    }

    return userInfo;
  }
}
