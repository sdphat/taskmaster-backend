import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BoardRole } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { ROLES_KEY } from './decorators/roles.decorator';
import { cookieConstants } from './constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: ExpressRequest = context.switchToHttp().getRequest();
    const currentUserRole = request.cookies?.[cookieConstants.roleCookieToken];
    const matchRoles = this.reflector.getAllAndOverride<BoardRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (matchRoles.includes(currentUserRole)) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
