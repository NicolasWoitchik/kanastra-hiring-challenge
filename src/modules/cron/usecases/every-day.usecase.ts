import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { BILLET_TOPIC_EXCHANGE } from '@modules/messaging/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EveryDayUseCase {
  constructor(
    @Inject(AmqpConnection) private readonly amqpConnection: AmqpConnection,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: 'EVERY_DAY',
  })
  // @Cron(CronExpression.EVERY_DAY_AT_4AM, {
  //   name: 'EVERY_DAY',
  // })
  async handleCron() {
    const today = new Date();

    const todayDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    await this.amqpConnection.publish(
      this.configService.get(BILLET_TOPIC_EXCHANGE),
      'billet.check_pending',
      {
        date: todayDate,
      },
    );
  }
}
