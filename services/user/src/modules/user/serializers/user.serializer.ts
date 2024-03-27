import { EntitySerializer } from '@/utils/entity-serializer';
import { User } from '@/modules/user/entities/user.entity';

export class UserSerializer extends EntitySerializer<User> {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: User) {
    super();
    this.id = entity.id;
    this.name = entity.name;
    this.surname = entity.surname;
    this.email = entity.email;
    this.role = entity.role;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
