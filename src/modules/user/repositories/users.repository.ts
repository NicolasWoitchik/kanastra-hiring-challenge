import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { In, Repository } from 'typeorm';
import { IUsersRepository } from './interfaces/users-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  createBulk(items: UserEntity[]): Promise<UserEntity[]> {
    return this.usersRepository.save(items);
  }
  findByEmails(emails: string[]): Promise<UserEntity[]> {
    return this.usersRepository.find({
      where: {
        email: In(emails),
      },
      select: {
        email: true,
      },
    });
  }
}
