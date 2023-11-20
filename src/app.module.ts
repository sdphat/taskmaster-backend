import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from './typeorm/typeorm.module';
import { PhotoModule } from './photo/photo.module';
import { UsersModule } from './users/users.module';
// import { ConfigModule } from '@nestjs/config';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule,
    PhotoModule,
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath:
    //     process.env.NODE_ENV === 'development'
    //       ? ['.env.development']
    //       : ['.env'],
    // }),
    ConfigModule,
  ],
  providers: [],
})
export class AppModule {}
