import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import bcrypt, { compare } from 'bcrypt';
import { IsNumber, IsString, validate } from 'class-validator';
import { UsersService } from '../users/users.service';
import { AccessTokenJwtService } from './AccessTokenJwt.service';
import { RefreshTokenJwtService } from './RefreshTokenJwt.service';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import ms from 'ms';
import { PrismaService } from '../prisma.service';

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
  avatarUrl: string;
}

export class UserPublicBriefInfo {
  fullName: string;
  email: string;
}

class PasswordResetCacheData {
  id: number;
  email: string;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private accessTokenJwtService: AccessTokenJwtService,
    private refreshTokenJwtService: RefreshTokenJwtService,
    private mailService: MailService,
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne(email, {
      id: true,
      avatarUrl: true,
      email: true,
      fullName: true,
      Credential: true,
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordMatches = await compare(password, user.Credential.password);
    if (!passwordMatches) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };
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

    // Check if a profile is already linked with password
    const user = await this.usersService.findOne(registerInfo.email, {
      Credential: true,
    });
    if (user && user.Credential) {
      throw new ConflictException();
    }

    const createdUser: User = await this.usersService.create({
      email: registerInfo.email,
      fullName: registerInfo.fullName,
      avatarUrl:
        'https://st3.depositphotos.com/3271841/13147/i/450/depositphotos_131477174-stock-photo-simple-colorful-gradient-light-blurred.jpg',
      password: await bcrypt.hash(
        registerInfo.password,
        +process.env.SALT_ROUNDS,
      ),
    });

    if (!createdUser) {
      throw new BadRequestException();
    }

    const payload = {
      sub: createdUser.id,
      email: createdUser.email,
      avatarUrl: createdUser.avatarUrl,
    };
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

    const payload = {
      sub: userInfo.sub,
      email: userInfo.email,
      avatarUrl: userInfo.avatarUrl,
    };
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
        avatarUrl: true,
      },
    );

    if (!userInfo) {
      throw new UnauthorizedException();
    }

    return userInfo;
  }

  generateResetPasswordToken() {
    return randomBytes(16).toString('hex');
  }

  async sendPasswordReset(email: string) {
    const userInfo = await this.usersService.findOne(email);
    if (!userInfo) {
      throw new NotFoundException();
    }

    const token = this.generateResetPasswordToken();
    await this.cacheManager.set(token, { id: userInfo.id, email }, ms('5m'));

    await this.mailService.send({
      from: this.mailService.SYSTEM_EMAIL,
      subject: 'Taskmaster password reset',
      isTransactional: true,
      to: email,
      bodyHtml: `There is a request to reset password of a taskmaster account associated with your email. Please ignore this email if you did not send a reset password request. If you did, click here to <a href='${process.env.FRONT_END_URL}/reset-password?token=${token}'>reset your password</a>`,
    });
  }

  async changePassword(token: string, password: string) {
    const cacheData =
      await this.cacheManager.get<PasswordResetCacheData>(token);
    if (!cacheData) {
      throw new NotFoundException();
    }

    await this.prismaService.credential.update({
      data: {
        password: await bcrypt.hash(password, +process.env.SALT_ROUNDS),
      },
      where: {
        email: cacheData.email,
      },
    });

    await this.cacheManager.del(token);
  }
}
