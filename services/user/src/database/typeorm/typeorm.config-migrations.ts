import { DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { config } from '@/config';

const typeOrmConfig: DataSourceOptions = {
  type: config.database.type as PostgresConnectionOptions['type'],
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  entities: [__dirname + '/../../**/**/*.entity.{ts,js}'],
  synchronize: true,
  logging: true,
  logger: 'advanced-console',
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
};

export = typeOrmConfig;
