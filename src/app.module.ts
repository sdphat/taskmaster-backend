import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [AuthModule, UsersModule, ConfigModule, BoardModule],
})
export class AppModule {}
