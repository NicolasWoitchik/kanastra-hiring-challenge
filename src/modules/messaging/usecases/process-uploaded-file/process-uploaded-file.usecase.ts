import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ProcessUploadedFileDTO } from './dtos/process-uploaded-file.dto';
import { IProcessUploadedFileUseCase } from './process-uploaded-file.interface';
import {
  defaultDeadLettersExchangeName,
  FILE_TOPIC_EXCHANGE,
  fileTopicExchangeName,
} from '@modules/messaging/constants';
import * as request from 'request';
import { GetObjectAclCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as Papa from 'papaparse';
import { Inject, Logger } from '@nestjs/common';
import { S3_CLIENT } from '@shared/storage/constants';
import { ConfigService } from '@nestjs/config';
import { ProcessGroupUploadedFileDTO } from '../process-group-uploaded-file/dtos/process-group-uploaded-file.dto';

export class ProcessUploadedFileUseCase implements IProcessUploadedFileUseCase {
  constructor(
    @Inject(S3_CLIENT) private readonly s3Client: S3Client,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(AmqpConnection) private readonly amqpConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: fileTopicExchangeName,
    routingKey: 'file.uploaded',
    queue: 'PROCESS_UPLOADED_FILE_QUEUE',
    errorHandler: (channel, msg, err) => {
      const logger = new Logger(ProcessUploadedFileUseCase.name);

      logger.error('consuming process uploded file rows', {
        err,
      });

      return channel.reject(msg, false);
    },
    queueOptions: {
      deadLetterExchange: defaultDeadLettersExchangeName,
      deadLetterRoutingKey: 'PROCESS_UPLOADED_FILE_DLX',
    },
  })
  execute(dto: ProcessUploadedFileDTO): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const logger = new Logger(ProcessUploadedFileUseCase.name);

      logger.log(
        `Starting processing uploaded file. ProcessID ${dto.processId}`,
        dto,
      );

      const getObject = new GetObjectAclCommand({
        Bucket: dto.bucket,
        Key: dto.filename,
      });

      const urlResponse = await getSignedUrl(this.s3Client, getObject, {
        expiresIn: 60,
      });

      const url = new URL(urlResponse);

      const dataStream = request.get(`${url.origin}${url.pathname}`, {
        method: 'get',
      });

      const parseStream = Papa.parse(Papa.NODE_STREAM_INPUT, {
        skipEmptyLines: true,
        header: true,
      });

      const rows = [];

      const groupLength = this.configService.get(
        'RABBITMQ_PROCESS_UPLOADED_FILE_GROUP_LENGTH',
        1000,
      );

      dataStream
        .pipe(parseStream)
        .on('data', (data) => {
          rows.push(data);
          if (rows.length > groupLength)
            this._publishGroup(rows.splice(0, groupLength), dto.processId);
        })
        .on('end', () => {
          if (rows.length > 0) this._publishGroup(rows, dto.processId);

          logger.log(
            `Finished processing uploaded file. ProcessID ${dto.processId}`,
            dto,
          );

          resolve();
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }

  async _publishGroup(rows: any[], processId: string) {
    const groupId = crypto.randomUUID().replace(/-/g, '');

    await this.amqpConnection.publish(
      this.configService.get(FILE_TOPIC_EXCHANGE),
      `file.process_group.${groupId}`,
      new ProcessGroupUploadedFileDTO(rows, groupId, processId),
    );
  }
}
