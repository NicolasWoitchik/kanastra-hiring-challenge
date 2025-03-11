export class ProcessGroupUploadedFileDTO {
  constructor(
    readonly items: unknown[],
    readonly groupId: string,
    readonly processId: string,
  ) {}
}
