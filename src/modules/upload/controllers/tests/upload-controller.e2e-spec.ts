import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UploadModule } from '@modules/upload/upload.module';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { S3_CLIENT } from '@shared/storage/constants';
import { MessagingModule } from '@modules/messaging/messaging.module';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from '@shared/storage/storage.module';

describe('UploadController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StorageModule, ConfigModule, MessagingModule, UploadModule],
      providers: [
        {
          provide: S3_CLIENT,
          useValue: jest.fn(),
        },
        {
          provide: AmqpConnection,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
      exports: [S3_CLIENT],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/upload (POST)', () => {
    const file = Buffer.from(
      `name,governmentId,email,debtAmount,debtDueDate,debtId
        John Doe,11111111111,johndoe@kanastra.com.br,1000000.00,2022-10-12,1adb6ccf-ff16-467f-bea7-5f05d494280f`,
    ).toString('binary');

    return request(app.getHttpServer())
      .post('/upload')
      .attach('file', file)
      .expect(200);
  });
});
