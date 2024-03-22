import { INestApplication } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';

export class AppFactory {
  private constructor(
    private appInstance: INestApplication,
    private dataSource: DataSource,
  ) {}

  get instance(): INestApplication {
    return this.appInstance;
  }

  static async new(): Promise<AppFactory> {
    const moduleBuilder: TestingModuleBuilder = await Test.createTestingModule({
      imports: [AppModule],
    });

    const module: TestingModule = await moduleBuilder.compile();

    const app: INestApplication = module.createNestApplication();

    await app.init();

    return new AppFactory(app, module.get(DataSource));
  }

  async close(): Promise<void> {
    await this.dataSource.destroy();

    if (this.appInstance) await this.appInstance.close();
  }

  async cleanupDB(): Promise<void> {
    const tables: string[] = this.dataSource.entityMetadatas.map(
      (entity) => entity.tableName,
    );

    for (const table of tables) {
      await this.dataSource.query(
        `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`,
      );
    }
  }
}
