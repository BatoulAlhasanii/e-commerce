import { Injectable } from '@nestjs/common';
import { userDefinition } from '@/database/factories/user.factory';
import { UserRepository } from '@/user/repositories/user.repository';
import { Factory } from '@/database/factories/factory';

@Injectable()
export class UserSeeder {
  constructor(private userRepository: UserRepository) {}

  async seed(): Promise<void> {
    await Factory.create(this.userRepository, userDefinition);
  }
}
