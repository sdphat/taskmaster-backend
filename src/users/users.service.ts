import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async findOne(
    email: string,
    select?: Prisma.UserSelectScalar,
  ): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      select,
      where: {
        email,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data });
  }
}
