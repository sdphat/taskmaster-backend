import { Module } from '@nestjs/common';
import { BoardColumnService } from './board-column.service';
import { BoardColumnController } from './board-column.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [BoardColumnController],
  providers: [BoardColumnService, PrismaService],
})
export class BoardColumnModule {}
