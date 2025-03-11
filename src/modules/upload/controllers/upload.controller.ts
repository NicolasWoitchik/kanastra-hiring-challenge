import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UPLOADED_FILE_USECASE } from '../constants';
import { IUploadedFileUseCase } from '../usecases/uploaded-file/uploaded-file.interface';
import { UploadedFileRequestDTO } from '../usecases/uploaded-file/dtos/request.dto';

@Controller('upload')
export class UploadController {
  constructor(
    @Inject(UPLOADED_FILE_USECASE)
    private readonly uploadedFileUseCase: IUploadedFileUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile()
    file: UploadedFileRequestDTO,
  ) {
    return this.uploadedFileUseCase.execute(file);
  }
}
