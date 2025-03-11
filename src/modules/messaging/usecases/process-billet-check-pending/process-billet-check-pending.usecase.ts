import { Inject, Injectable, Logger } from '@nestjs/common';
import { IProcessBilletCheckPendingUseCase } from './process-billet-check-pending.interface';
import { ProcessBilletCheckPendingRequestDTO } from './dtos/process-billet-check-pending-request.dto';
import {
  billetTopicExchangeName,
  defaultDeadLettersExchangeName,
} from '@modules/messaging/constants';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ProcessGroupUploadedFileUseCase } from '../process-group-uploaded-file/process-group-uploaded-file.usecase';
import { BILLETS_REPOSITORY } from '@modules/billet/constants';
import { IBilletsRepository } from '@modules/billet/repositories/interfaces/billets-repository.interface';

@Injectable()
export class ProcessBilletCheckPendingUseCase
  implements IProcessBilletCheckPendingUseCase
{
  constructor(
    @Inject(BILLETS_REPOSITORY)
    private readonly billetRepository: IBilletsRepository,
    @Inject(AmqpConnection)
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: billetTopicExchangeName,
    routingKey: 'billet.check_pending',
    queue: 'PROCESS_BILLET_CHECK_PENDING_QUEUE',
    errorHandler: (channel, msg, err) => {
      const logger = new Logger(ProcessGroupUploadedFileUseCase.name);

      logger.error('consuming process billet check pending', {
        err,
      });

      return channel.reject(msg, false);
    },
    queueOptions: {
      deadLetterExchange: defaultDeadLettersExchangeName,
      deadLetterRoutingKey: 'PROCESS_BILLET_CHECK_PENDING_DLX',
    },
  })
  async execute(dto: ProcessBilletCheckPendingRequestDTO): Promise<void> {
    const logger = new Logger(ProcessBilletCheckPendingUseCase.name);

    logger.log(
      `Starting processing billet check pending. Date ${dto.date}`,
      dto,
    );

    await this.findAllPendingbilletsAndPublish(dto, logger);

    await logger.log('Finished processing billet check pending');
  }

  async findAllPendingbilletsAndPublish(
    dto: ProcessBilletCheckPendingRequestDTO,
    logger: Logger,
    offset = 0,
  ): Promise<void> {
    const pendingBills =
      await this.billetRepository.findAllPendingByDebtDueDate(dto.date, offset);

    if (!pendingBills) return logger.log('No pending billets to process');

    logger.log(`Found ${pendingBills.length} pending billets to process`);

    await this.amqpConnection.publish(
      billetTopicExchangeName,
      'billet.process_payment',
      pendingBills,
    );

    return this.findAllPendingbilletsAndPublish(dto, logger, offset + 50);
  }
}
