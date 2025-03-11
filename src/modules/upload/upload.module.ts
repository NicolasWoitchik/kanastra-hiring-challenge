import { Module } from '@nestjs/common';
import { UploadController } from './controllers/upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';
import { SetUploadFilenameUseCase } from './usecases/set-upload-filename/set-upload-filename.usecase';
import { SetUploadMetadataUseCase } from './usecases/set-upload-metadata/set-upload-metadata.usecase';
import { CheckFileContentTypeUseCase } from './usecases/check-file-content-type/check-file-content-type.usecase';
import {
  CHECK_FILE_CONTENT_TYPE_USECASE,
  SET_UPLOAD_FILENAME_USECASE,
  SET_UPLOAD_METADATA_USECASE,
  UPLOADED_FILE_USECASE,
} from './constants';
import { UploadedFileUseCase } from './usecases/uploaded-file/uploaded-file.usecase';
import { ICheckFileContentTypeUseCase } from './usecases/check-file-content-type/check-file-content-type.interface';
import { ISetUploadFilenameUseCase } from './usecases/set-upload-filename/set-upload-filename.interface';
import { ISetUploadMetadataUseCase } from './usecases/set-upload-metadata/set-upload-metadata.interface';
import { MessagingModule } from '@modules/messaging/messaging.module';
import { S3_CLIENT } from '@shared/storage/constants';

@Module({
  imports: [
    ConfigModule,
    MessagingModule,
    MulterModule.registerAsync({
      imports: [ConfigModule, UploadModule],
      useFactory: (
        configService: ConfigService,
        setUploadFilenameUseCase: ISetUploadFilenameUseCase,
        setUploadMetadataUseCase: ISetUploadMetadataUseCase,
        checkFileContentTypeUseCase: ICheckFileContentTypeUseCase,
        s3: S3Client,
      ) => {
        return {
          dest: configService.get('AWS_BUCKET'),
          storage: multerS3({
            s3: s3,
            bucket: configService.get('AWS_BUCKET'),
            metadata: setUploadMetadataUseCase.execute,
            key: setUploadFilenameUseCase.execute,
            contentType: (req, file, callback) => {
              callback(null, file.mimetype);
            },
          }),
          fileFilter: checkFileContentTypeUseCase.execute,
        };
      },
      inject: [
        ConfigService,
        SET_UPLOAD_FILENAME_USECASE,
        SET_UPLOAD_METADATA_USECASE,
        CHECK_FILE_CONTENT_TYPE_USECASE,
        S3_CLIENT,
      ],
    }),
  ],
  controllers: [UploadController],
  providers: [
    {
      provide: SET_UPLOAD_METADATA_USECASE,
      useClass: SetUploadMetadataUseCase,
    },
    {
      provide: SET_UPLOAD_FILENAME_USECASE,
      useClass: SetUploadFilenameUseCase,
    },
    {
      provide: CHECK_FILE_CONTENT_TYPE_USECASE,
      useClass: CheckFileContentTypeUseCase,
    },
    {
      provide: UPLOADED_FILE_USECASE,
      useClass: UploadedFileUseCase,
    },
  ],
  exports: [
    SET_UPLOAD_METADATA_USECASE,
    SET_UPLOAD_FILENAME_USECASE,
    CHECK_FILE_CONTENT_TYPE_USECASE,
  ],
})
export class UploadModule {}
