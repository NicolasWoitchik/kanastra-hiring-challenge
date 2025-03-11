import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  billetTopicExchangeName,
  defaultDeadLettersExchangeName,
} from '@modules/messaging/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { BilletEntity } from '@modules/billet/entities/billet.entity';
import { IProcessBilletPaymentUseCase } from './process-billet-payment.interface';
import { BILLETS_REPOSITORY } from '@modules/billet/constants';
import { IBilletsRepository } from '@modules/billet/repositories/interfaces/billets-repository.interface';
import { BilletStatusEnum } from '@modules/billet/enums/billet-status.enum';

@Injectable()
export class ProcessBilletPaymentUseCase
  implements IProcessBilletPaymentUseCase
{
  constructor(
    @Inject(BILLETS_REPOSITORY)
    private readonly billetRepository: IBilletsRepository,
  ) {}

  @RabbitSubscribe({
    exchange: billetTopicExchangeName,
    routingKey: 'billet.process_payment',
    queue: 'PROCESS_BILLET_PAYMENT_QUEUE',
    errorHandler: (channel, msg, err) => {
      const logger = new Logger(ProcessBilletPaymentUseCase.name);

      logger.error('consuming process billet payment', {
        err,
      });

      return channel.reject(msg, false);
    },
    queueOptions: {
      deadLetterExchange: defaultDeadLettersExchangeName,
      deadLetterRoutingKey: 'PROCESS_BILLET_PAYMENT_DLX',
    },
  })
  async execute(dto: BilletEntity): Promise<void> {
    const logger = new Logger(ProcessBilletPaymentUseCase.name);

    logger.log(`Starting processing billet payment. BilletID ${dto.id}`, dto);

    const billet = await this.billetRepository.findById(dto.id);

    if (!billet) return logger.error(`Billet ${dto.id} not found`);

    if (billet.status != BilletStatusEnum.PENDING)
      return logger.error(`Billet ${dto.id} not pending`);

    dto.status = BilletStatusEnum.PAID;

    await this.billetRepository.update(dto);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    logger.log('Finished processing billet payment');
  }
}
