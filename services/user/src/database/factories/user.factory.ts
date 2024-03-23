import { faker } from '@faker-js/faker';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { User } from '@/user/entity/user.entity';
import { UserRole } from '@/user/enums/user-role.enum';
import { getRandomEnumValue } from '@/helpers/random-enum-value.helper';

export const userDefinition = (): DeepPartial<User> => {
  return {
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    email: faker.internet.email(),
    password: 'password',
    role: getRandomEnumValue(UserRole),
  };
};
