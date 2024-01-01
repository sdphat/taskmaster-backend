import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [MulterModule.register(), ConfigModule],
  controllers: [AttachmentController],
  providers: [AttachmentService],
})
export class AttachmentModule {}
