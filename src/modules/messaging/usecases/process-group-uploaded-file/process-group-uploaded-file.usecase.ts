import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  defaultDeadLettersExchangeName,
  fileTopicExchangeName,
} from '@modules/messaging/constants';
import { Inject, Logger } from '@nestjs/common';
import { IProcessGroupUploadedFileUseCase } from './process-group-uploaded-file.interface';
import { ProcessGroupUploadedFileDTO } from './dtos/process-group-uploaded-file.dto';
import { CREATE_BULK_USERS_USECASE } from '@modules/user/constants';
import { ICreateBulkUsersUseCase } from '@modules/user/usecases/create-bulk-users/create-bulk-users.interface';
import { CREATE_BULK_BILLET_USECASE } from '@modules/billet/constants';
import { ICreateBulkBilletsUseCase } from '@modules/billet/usecases/create-bulk-billets/create-bulk-billets.interface';

export class ProcessGroupUploadedFileUseCase
  implements IProcessGroupUploadedFileUseCase
{
  constructor(
    @Inject(CREATE_BULK_USERS_USECASE)
    private readonly createBulkUsersUseCase: ICreateBulkUsersUseCase,
    @Inject(CREATE_BULK_BILLET_USECASE)
    private readonly createBulkBilletsUseCase: ICreateBulkBilletsUseCase,
  ) {}

  @RabbitSubscribe({
    exchange: fileTopicExchangeName,
    routingKey: 'file.process_group.#',
    queue: 'PROCESS_GROUP_UPLOADED_FILE_QUEUE',
    errorHandler: (channel, msg, err) => {
      const logger = new Logger(ProcessGroupUploadedFileUseCase.name);

      logger.error('consuming process group uploded file rows', {
        err,
      });

      return channel.reject(msg, false);
    },
    queueOptions: {
      deadLetterExchange: defaultDeadLettersExchangeName,
      deadLetterRoutingKey: 'PROCESS_GROUP_UPLOADED_FILE_DLX',
    },
  })
  async execute(dto: ProcessGroupUploadedFileDTO): Promise<void> {
    const logger = new Logger(dto.processId);

    if (!dto.items.length) return logger.log('No items to process');

    await this.createBulkUsersUseCase.execute(dto.items);

    await this.createBulkBilletsUseCase.execute(dto.items);

    await logger.log('Finished processing group uploaded file');
  }
}
