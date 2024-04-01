import { Repository } from 'typeorm/repository/Repository';
import { DeepPartial } from 'typeorm/common/DeepPartial';

export class Factory {
  public static async create<Entity, R extends Repository<Entity>>(
    repo: R,
    definition: () => DeepPartial<Entity>,
    values: DeepPartial<Entity> | {} = {},
  ): Promise<Entity> {
    const instance: Entity = repo.create({ ...definition(), ...values });

    return await repo.save(instance);
  }

  public static async createMany<Entity, R extends Repository<Entity>>(
    repo: R,
    definition: () => DeepPartial<Entity>,
    count: number = 1,
    values: DeepPartial<Entity> | {} = {},
  ): Promise<Entity[]> {
    const areValuesOverridden: boolean = Object.keys(values).length != 0;

    const instances: DeepPartial<Entity>[] = Array.from(
      { length: count },
      (): DeepPartial<Entity> => (areValuesOverridden ? { ...definition(), ...values } : definition()),
    );

    return await repo.save(instances);
  }
}
