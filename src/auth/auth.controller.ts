import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
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
import { jwtConstants } from './constants';
import { Public } from './decorators/public.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginWithGoogleDto } from './dto/login-with-google.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private constructURL(req: ExpressRequest) {
    return new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
  }

  private attachAccessToken(
    request: ExpressRequest,
    response: ExpressResponse,
    accessToken: string,
  ) {
    const url = this.constructURL(request);
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV !== 'development',
      maxAge: ms(jwtConstants.accessTokenMaxAge),
    });
  }

  private attachRefreshToken(
    request: ExpressRequest,
    response: ExpressResponse,
    refreshToken: string,
  ) {
    const url = this.constructURL(request);
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
      maxAge: ms(jwtConstants.refreshTokenMaxAge),
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/google')
  @Public()
  async loginWithGoogle(
    @Body() loginWithGoogleDto: LoginWithGoogleDto,
    @Req() request: ExpressRequest,
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    const { access_token, refresh_token } =
      await this.authService.signInWithGoogle(loginWithGoogleDto.code);
    this.attachAccessToken(request, response, access_token);
    this.attachRefreshToken(request, response, refresh_token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  async signIn(
    @Body() signInDto: SignInDto,
    @Req() request: ExpressRequest,
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    const { access_token, refresh_token } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    this.attachAccessToken(request, response, access_token);
    this.attachRefreshToken(request, response, refresh_token);
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
    this.attachAccessToken(request, response, access_token);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.email);
  }

  @Public()
  @Post('password-reset')
  async resetPassword(@Body() { email }: PasswordResetDto) {
    return await this.authService.sendPasswordReset(email);
  }

  @Public()
  @Post('change-password')
  async changePassword(@Body() { token, password }: ChangePasswordDto) {
    return await this.authService.changePassword(token, password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @Public()
  async register(
    @Body() registerDto: RegisterDto,
    @Request() request: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const { access_token, refresh_token } =
      await this.authService.register(registerDto);
    this.attachAccessToken(request, res, access_token);
    this.attachRefreshToken(request, res, refresh_token);
  }

  @Post('logout')
  async logout(
    @Request() req: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const cookies = Object.keys(req.cookies);
    cookies.forEach((cookie) => {
      res.clearCookie(cookie);
    });
  }
}
