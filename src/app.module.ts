import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '@modules/health/health.module';
import { UploadModule } from '@modules/upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from '@shared/storage/storage.module';
import { DatabaseModule } from '@shared/database/database.module';
import { BilletsModule } from '@modules/billet/billets.module';
import { UsersModule } from '@modules/user/user.module';
import { CronModule } from '@modules/cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    HealthModule,
    UsersModule,
    StorageModule,
    UploadModule,
    BilletsModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
