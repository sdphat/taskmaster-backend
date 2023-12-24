import { SetMetadata } from '@nestjs/common';
import { BoardRole } from '@prisma/client';

export const ROLES_KEY = 'Roles';
export const Roles = (roles: BoardRole[]) => SetMetadata(ROLES_KEY, roles);
