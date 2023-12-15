import { Module } from '@nestjs/common';
import { CardLabelService } from './card-label.service';
import { CardLabelController } from './card-label.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CardLabelController],
  providers: [CardLabelService, PrismaService],
})
export class CardLabelModule {}
