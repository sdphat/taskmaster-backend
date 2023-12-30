import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async findOne(email: string, select?: Prisma.UserSelect) {
    return this.prismaService.user.findUnique({
      select,
      where: {
        email,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prismaService.user.create({ data });
  }
}
