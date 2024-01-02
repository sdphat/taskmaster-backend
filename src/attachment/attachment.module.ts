import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '../config/config.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [MulterModule.register(), ConfigModule],
  controllers: [AttachmentController],
  providers: [AttachmentService, PrismaService],
})
export class AttachmentModule {}
