import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async findOne(email: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
}
