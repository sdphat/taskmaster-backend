import { DynamicModule } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

export const ConfigModule: DynamicModule = NestConfigModule.forRoot({
  envFilePath:
    process.env.NODE_ENV === 'development' ? ['.env.development'] : ['.env'],
});
