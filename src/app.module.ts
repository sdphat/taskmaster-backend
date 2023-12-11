import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { BoardModule } from './board/board.module';
import { BoardCardModule } from './board-card/board-card.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule,
    BoardModule,
    BoardCardModule,
    CommentModule,
  ],
})
export class AppModule {}
