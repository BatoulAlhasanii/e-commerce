import { Controller, Get } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './entity/user.entity';
import { Factory } from '@/database/factories/factory';
import { userDefinition } from '@/database/factories/user.factory';

@Controller('users')
export class UserController {
  constructor(private userRepository: UserRepository) {}
  @Get('/')
  async create() {
    const val: User = await Factory.create(this.userRepository, userDefinition);

    return val;
  }
}
