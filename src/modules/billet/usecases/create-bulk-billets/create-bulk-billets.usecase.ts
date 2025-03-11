import { BILLETS_REPOSITORY } from '@modules/billet/constants';
import { IBilletsRepository } from '@modules/billet/repositories/interfaces/billets-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ICreateBulkBilletsUseCase } from './create-bulk-billets.interface';
import { BilletEntity } from '@modules/billet/entities/billet.entity';
import { BilletStatusEnum } from '@modules/billet/enums/billet-status.enum';

@Injectable()
export class CreateBulkBilletsUseCase implements ICreateBulkBilletsUseCase {
  constructor(
    @Inject(BILLETS_REPOSITORY)
    private readonly billetRepository: IBilletsRepository,
  ) {}

  async execute(request: Partial<BilletEntity>[]): Promise<void> {
    const items: BilletEntity[] = request.map((item) => ({
      id: item.id,
      status: BilletStatusEnum.PENDING,
      user_id: item.user_id,
      debt_mount: item.debt_mount,
      debt_due_date: item.debt_due_date,
      updated_at: new Date(),
      created_at: new Date(),
    }));

    await this.billetRepository.createBulk(items);
  }
}
