export class ProcessUploadedFileDTO {
  constructor(
    readonly bucket: string,
    readonly filename: string,
    readonly mimetype: string,
    readonly processId: string,
  ) {}
}
