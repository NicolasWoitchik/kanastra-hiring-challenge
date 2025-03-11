import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CREATE_BULK_USERS_USECASE, USERS_REPOSITORY } from './constants';
import { UsersRepository } from './repositories/users.repository';
import { CreateBulkUsersUseCase } from './usecases/create-bulk-users/create-bulk-users.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
    {
      provide: CREATE_BULK_USERS_USECASE,
      useClass: CreateBulkUsersUseCase,
    },
  ],
  exports: [CREATE_BULK_USERS_USECASE],
})
export class UsersModule {}
