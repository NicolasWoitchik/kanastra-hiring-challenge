export interface ISetUploadFilenameUseCase {
  execute(
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: any, metadata?: any) => void,
  ): Promise<void>;
}
