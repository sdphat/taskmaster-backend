import { Module } from '@nestjs/common';
import { BoardCardController } from './board-card.controller';
import { BoardCardService } from './board-card.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [BoardCardController],
  providers: [BoardCardService, PrismaService],
})
export class BoardCardModule {}
