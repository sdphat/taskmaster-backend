import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

export interface CreateUserData {
  email: string;
  avatarUrl: string;
  fullName: string;
  password: string;
}

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

  async create({ avatarUrl, email, fullName, password }: CreateUserData) {
    return this.prismaService.user.upsert({
      // Create profile and credential if profile not found
      create: {
        avatarUrl,
        email,
        fullName,
        Credential: {
          create: {
            password,
          },
        },
      },

      // Update profile info and create credential if profile is found with specified email
      update: {
        avatarUrl,
        fullName,
        Credential: {
          create: {
            password,
          },
        },
      },
      where: {
        email,
      },
    });
  }
}
