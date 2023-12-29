import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { PrismaService } from '../prisma.service';
import { InvitationCodeGeneratorService } from './invitation-code-generator/invitation-code-generator.service';
import { MailModule } from '../mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [MailModule, CacheModule.register()],
  controllers: [MemberController],
  providers: [MemberService, PrismaService, InvitationCodeGeneratorService],
})
export class MemberModule {}
