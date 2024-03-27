export abstract class EntitySerializer<Entity> {
  static transform<Entity, T extends EntitySerializer<Entity>>(
    model: Entity,
  ): T {
    const serializerClass: undefined | (new (entity: Entity) => T) = this
      .prototype.constructor as new () => T;

    return new serializerClass(model);
  }

  static transformMany<Entity, T extends EntitySerializer<Entity>>(
    models: Entity[],
  ): T[] {
    return models.map((model: Entity): T => this.transform(model));
  }
}
