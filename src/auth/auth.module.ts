import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { UsersModule } from '../users/users.module';
import { AccessTokenJwtService } from './AccessTokenJwt.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RefreshTokenJwtService } from './RefreshTokenJwt.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    PrismaService,
    AccessTokenJwtService,
    RefreshTokenJwtService,
  ],
})
export class AuthModule {}
