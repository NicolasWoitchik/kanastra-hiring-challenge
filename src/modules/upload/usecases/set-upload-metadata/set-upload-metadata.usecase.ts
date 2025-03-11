import { ISetUploadMetadataUseCase } from './set-upload-metadata.interface';

export class SetUploadMetadataUseCase implements ISetUploadMetadataUseCase {
  async execute(
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: any, metadata?: any) => void,
  ): Promise<void> {
    callback(null, Object.assign({}, (req as any).body));
  }
}
