import { Module } from '@nestjs/common';
import { AttachmentModule } from './attachment/attachment.module';
import { AuthModule } from './auth/auth.module';
import { BoardCardModule } from './board-card/board-card.module';
import { BoardColumnModule } from './board-column/board-column.module';
import { BoardModule } from './board/board.module';
import { CardLabelModule } from './card-label/card-label.module';
import { CommentModule } from './comment/comment.module';
import { ConfigModule } from './config/config.module';
import { MailModule } from './mail/mail.module';
import { MemberModule } from './member/member.module';
import { UsersModule } from './users/users.module';

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
    MailModule,
    BoardColumnModule,
    AttachmentModule,
  ],
})
export class AppModule {}
