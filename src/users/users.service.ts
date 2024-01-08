import { ForbiddenException, Injectable } from '@nestjs/common';
import { CredentialProvider, Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';

export type CreateUserData =
  | {
      provider: typeof CredentialProvider.LOCAL;
      email: string;
      avatarUrl: string;
      fullName: string;
      password: string;
    }
  | {
      provider: typeof CredentialProvider.GOOGLE;
      email: string;
      avatarUrl: string;
      fullName: string;
    };

export type UpdateUserData = Partial<
  Pick<User, 'id' | 'avatarUrl' | 'fullName'>
>;

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

  async createAndUpdate(data: CreateUserData) {
    const upsertData: Prisma.UserUpsertArgs['create'] = {
      avatarUrl: data.avatarUrl,
      email: data.email,
      fullName: data.fullName,
      Credential: {
        create: {
          provider: data.provider,
          password: data.provider === 'LOCAL' ? data.password : undefined,
        },
      },
    };

    // Create credential and update matched profile
    return this.prismaService.user.upsert({
      create: upsertData,
      update: upsertData,
      where: {
        email: data.email,
      },
    });
  }

  async update({ id, ...data }: UpdateUserData, select: Prisma.UserSelect) {
    try {
      return await this.prismaService.user.update({
        data,
        select,
        where: { id },
      });
    } catch (err) {
      throw new ForbiddenException();
    }
  }
}
