import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Response,
} from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import ms from 'ms';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private attachAccessToken(response: ExpressResponse, accessToken: string) {
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: ms(process.env.ACCESS_TOKEN_MAX_AGE),
      domain: 'localhost',
      sameSite: 'strict',
    });
  }

  private attachRefreshToken(response: ExpressResponse, refreshToken: string) {
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: ms(process.env.REFRESH_TOKEN_MAX_AGE),
      domain: 'localhost',
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
  async refresh(
    @Request() request: ExpressRequest,
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    const { access_token } = await this.authService.refresh(refreshToken);
    this.attachAccessToken(response, access_token);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
