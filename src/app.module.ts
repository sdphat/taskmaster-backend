import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [AuthModule, UsersModule, ConfigModule],
})
export class AppModule {}
