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
import { RolesGuard } from './roles.guard';
import { MailModule } from '../mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
    }),
    MailModule,
    CacheModule.register(),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    RolesGuard,
    PrismaService,
    AccessTokenJwtService,
    RefreshTokenJwtService,
  ],
  exports: [RolesGuard],
})
export class AuthModule {}
