import { BilletEntity } from '../../entities/billet.entity';

export interface IBilletsRepository {
  createBulk(items: BilletEntity[]): Promise<BilletEntity[]>;
  update(billet: BilletEntity): Promise<BilletEntity>;
  findAllPendingByDebtDueDate(
    date: Date,
    offset?: number,
  ): Promise<BilletEntity[]>;
}
