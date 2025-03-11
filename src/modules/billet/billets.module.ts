import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BilletEntity } from './entities/billet.entity';
import { BILLETS_REPOSITORY, CREATE_BULK_BILLET_USECASE } from './constants';
import { BilletsRepository } from './repositories/billets.repository';
import { CreateBulkBilletsUseCase } from './usecases/create-bulk-billets/create-bulk-billets.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([BilletEntity])],
  providers: [
    {
      provide: BILLETS_REPOSITORY,
      useClass: BilletsRepository,
    },
    {
      provide: CREATE_BULK_BILLET_USECASE,
      useClass: CreateBulkBilletsUseCase,
    },
  ],
  exports: [CREATE_BULK_BILLET_USECASE, BILLETS_REPOSITORY],
})
export class BilletsModule {}
