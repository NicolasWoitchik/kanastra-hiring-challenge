import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagingEnviromentVariables } from './messaging-config.interface';
import {
  BILLET_TOPIC_EXCHANGE,
  EXCHANGE_DEADLETTERS_NAME,
  FILE_TOPIC_EXCHANGE,
  PROCESS_BILLET_CHECK_PENDING_USECASE,
  PROCESS_GROUP_UPLOADED_FILE_USECASE,
  PROCESS_UPLOADED_FILE_USECASE,
} from './constants';
import { ProcessUploadedFileUseCase } from './usecases/process-uploaded-file/process-uploaded-file.usecase';
import { ProcessGroupUploadedFileUseCase } from './usecases/process-group-uploaded-file/process-group-uploaded-file.usecase';
import { BilletsModule } from '@modules/billet/billets.module';
import { UsersModule } from '@modules/user/user.module';
import { ProcessBilletCheckPendingUseCase } from './usecases/process-billet-check-pending/process-billet-check-pending.usecase';

@Module({
  imports: [
    ConfigModule,
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (
        configService: ConfigService<MessagingEnviromentVariables>,
      ) => {
        const fileTopicExchange = {
          name: configService.get(FILE_TOPIC_EXCHANGE, 'FILE_TOPIC', {
            infer: true,
          }),
          type: 'topic',
        };
        const billetTopicExchange = {
          name: configService.get(BILLET_TOPIC_EXCHANGE, 'BILLET_TOPIC', {
            infer: true,
          }),
          type: 'topic',
        };

        const defaultDeadLettersExchange = {
          name: configService.get(
            EXCHANGE_DEADLETTERS_NAME,
            'KANASTRA_DEADLETTERS',
            { infer: true },
          ),
          type: 'direct',
        };

        const clientConnectionId = crypto.randomUUID().replace(/-/g, '');

        return {
          exchanges: [
            fileTopicExchange,
            billetTopicExchange,
            defaultDeadLettersExchange,
          ],
          uri: configService.get('RABBITMQ_KANASTRA_CONNECTION_STRING', {
            infer: true,
          }),
          channels: {},
          connectionInitOptions: {
            wait: configService.get('RABBITMQ_KANASTRA_CONNECTION_WAIT', true, {
              infer: true,
            }),
            timeout: configService.get(
              'RABBITMQ_KANASTRA_CONNECTION_TIMEOUT',
              10000,
              { infer: true },
            ),
          },
          prefetchCount: configService.get(
            'RABBITMQ_KANASTRA_PREFETCH_COUNT',
            1,
            { infer: true },
          ),
          registerHandlers: configService.get(
            'RABBITMQ_KANASTRA_REGISTER_HANDLERS',
            true,
            { infer: true },
          ),
          connectionManagerOptions: {
            connectionOptions: {
              clientProperties: {
                connection_name: clientConnectionId,
              },
            },
          },
        };
      },
    }),
    UsersModule,
    BilletsModule,
  ],
  providers: [
    {
      provide: PROCESS_UPLOADED_FILE_USECASE,
      useClass: ProcessUploadedFileUseCase,
    },
    {
      provide: PROCESS_GROUP_UPLOADED_FILE_USECASE,
      useClass: ProcessGroupUploadedFileUseCase,
    },
    {
      provide: PROCESS_BILLET_CHECK_PENDING_USECASE,
      useClass: ProcessBilletCheckPendingUseCase,
    },
  ],
  exports: [RabbitMQModule],
})
export class MessagingModule {}
