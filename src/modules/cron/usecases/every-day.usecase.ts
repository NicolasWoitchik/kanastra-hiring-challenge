import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { FILE_TOPIC_EXCHANGE } from '@modules/messaging/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EveryDayUseCase {
  constructor(
    @Inject(AmqpConnection) private readonly amqpConnection: AmqpConnection,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_4AM, {
    name: 'EVERY_DAY',
  })
  handleCron() {
    const today = new Date();

    this.amqpConnection.publish(
      this.configService.get(FILE_TOPIC_EXCHANGE),
      'billet.check_pending',
      {
        date: today,
      },
    );
  }
}
