export class ProcessGroupUploadedFileItemDTO {
  constructor(
    readonly name: string,
    readonly governmentId: string,
    readonly email: string,
    readonly debtAmount: string,
    readonly debtDueDate: string,
    readonly debtId: string,
  ) {}
}
