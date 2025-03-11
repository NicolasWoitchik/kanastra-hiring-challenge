import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BilletEntity } from '../entities/billet.entity';
import { Repository } from 'typeorm';
import { IBilletsRepository } from './interfaces/billets-repository.interface';
import { BilletStatusEnum } from '../enums/billet-status.enum';

@Injectable()
export class BilletsRepository implements IBilletsRepository {
  constructor(
    @InjectRepository(BilletEntity)
    private readonly typeormRepository: Repository<BilletEntity>,
  ) {}

  findById(id: string): Promise<BilletEntity> {
    return this.typeormRepository.findOne({
      where: {
        id,
      },
    });
  }

  createBulk(items: BilletEntity[]): Promise<BilletEntity[]> {
    return this.typeormRepository.save(items);
  }
  async update(billet: BilletEntity): Promise<void> {
    await this.typeormRepository.update(billet.id, billet);
  }
  findAllPendingByDebtDueDate(
    date: string,
    offset: number = 0,
  ): Promise<BilletEntity[]> {
    return this.typeormRepository.find({
      where: {
        debt_due_date: date,
        status: BilletStatusEnum.PENDING,
      },
      skip: offset,
    });
  }
}
