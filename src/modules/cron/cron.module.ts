import { MessagingModule } from '@modules/messaging/messaging.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EVERY_DAY_USECASE } from './constants';
import { EveryDayUseCase } from './usecases/every-day.usecase';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule, MessagingModule],
  providers: [
    {
      provide: EVERY_DAY_USECASE,
      useClass: EveryDayUseCase,
    },
  ],
})
export class CronModule {}
