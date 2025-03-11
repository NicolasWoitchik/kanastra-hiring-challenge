import { ISetUploadFilenameUseCase } from './set-upload-filename.interface';

export class SetUploadFilenameUseCase implements ISetUploadFilenameUseCase {
  async execute(
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: any, metadata?: any) => void,
  ): Promise<void> {
    callback(null, crypto.randomUUID() + '.' + file.mimetype.split('/')[1]);
  }
}
