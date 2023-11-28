import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import ms from 'ms';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/sign-in.dto';
import { jwtConstants } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private attachAccessToken(response: ExpressResponse, accessToken: string) {
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: ms(jwtConstants.accessTokenMaxAge),
      // domain: 'localhost',
      sameSite: 'strict',
    });
  }

  private attachRefreshToken(response: ExpressResponse, refreshToken: string) {
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: ms(jwtConstants.refreshTokenMaxAge),
      // domain: 'localhost',
      sameSite: 'strict',
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  async signIn(
    @Body() signInDto: SignInDto,
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    const { access_token, refresh_token } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    this.attachAccessToken(response, access_token);
    this.attachRefreshToken(response, refresh_token);
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  @Public()
  async refresh(
    @Request() request: ExpressRequest,
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const { access_token } = await this.authService.refresh(refreshToken);
    this.attachAccessToken(response, access_token);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @Public()
  async register(
    @Body() registerDto: RegisterDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const { access_token, refresh_token } =
      await this.authService.register(registerDto);
    this.attachAccessToken(res, access_token);
    this.attachRefreshToken(res, refresh_token);
  }
}
