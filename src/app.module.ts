import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { BoardModule } from './board/board.module';
import { BoardCardModule } from './board-card/board-card.module';
import { CommentModule } from './comment/comment.module';
import { CardLabelModule } from './card-label/card-label.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule,
    BoardModule,
    BoardCardModule,
    CommentModule,
    CardLabelModule,
    MemberModule,
  ],
})
export class AppModule {}
