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
import { BilletEntity } from '@modules/billet/entities/billet.entity';
import { BilletStatusEnum } from '@modules/billet/enums/billet-status.enum';
import { UserEntity } from '@modules/user/entities/user.entity';

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

    const usersToCreate: UserEntity[] = dto.items.map((item) => ({
      id: null,
      name: item.name,
      email: item.email.trim(),
      governmentId: item.governmentId,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const users = await this.createBulkUsersUseCase.execute(usersToCreate);

    const usersMap = new Map(users.map((user) => [user.email, user.id]));

    const billets: BilletEntity[] = dto.items.map((item) => ({
      id: item.debtId.trim(),
      status: BilletStatusEnum.PENDING,
      debt_mount: Number(item.debtAmount.trim()),
      debt_due_date: item.debtDueDate.trim(),
      user_id: usersMap.get(item.email.trim()),
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await this.createBulkBilletsUseCase.execute(billets);

    await logger.log('Finished processing group uploaded file');
  }
}
