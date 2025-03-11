import { Module, Global } from '@nestjs/common';
import { S3_CLIENT } from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: S3_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          endpoint: configService.get('AWS_ENDPOINT'),
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
        });
      },
    },
  ],
  exports: [S3_CLIENT],
})
export class StorageModule {}
