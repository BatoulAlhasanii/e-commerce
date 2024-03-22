import { faker } from '@faker-js/faker';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { User } from '@/user/entity/user.entity';

export const userDefinition = (): DeepPartial<User> => {
  return {
    name: faker.internet.userName(),
    age: faker.number.int({ min: 20, max: 50 }),
  };
};
