import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  billetTopicExchangeName,
  defaultDeadLettersExchangeName,
} from '@modules/messaging/constants';
import { Injectable, Logger } from '@nestjs/common';
import { ProcessGroupUploadedFileUseCase } from '../process-group-uploaded-file/process-group-uploaded-file.usecase';
import { BilletEntity } from '@modules/billet/entities/billet.entity';
import { IProcessBilletPaymentUseCase } from './process-billet-payment.interface';

@Injectable()
export class ProcessBilletPaymentUseCase
  implements IProcessBilletPaymentUseCase
{
  constructor() {}

  @RabbitSubscribe({
    exchange: billetTopicExchangeName,
    routingKey: 'billet.process_payment',
    queue: 'PROCESS_BILLET_PAYMENT_QUEUE',
    errorHandler: (channel, msg, err) => {
      const logger = new Logger(ProcessGroupUploadedFileUseCase.name);

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
    const logger = new Logger(ProcessGroupUploadedFileUseCase.name);

    logger.log(`Starting processing billet payment. BilletID ${dto.id}`, dto);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    logger.log('Finished processing billet payment');
  }
}
