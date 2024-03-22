import { Repository } from 'typeorm';
import { EntityRepository } from '@/database/typeorm/typeorm-entity-repository.decorator';
import { User } from '@/user/entity/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
