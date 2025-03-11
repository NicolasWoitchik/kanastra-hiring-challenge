import { ICheckFileContentTypeUseCase } from './check-file-content-type.interface';

export class CheckFileContentTypeUseCase
  implements ICheckFileContentTypeUseCase
{
  execute(
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: any, metadata?: any) => void,
  ) {
    if (
      file?.mimetype === 'text/csv' ||
      file?.mimetype === 'application/vnd.ms-excel'
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }
}
