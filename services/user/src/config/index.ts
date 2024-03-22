import { appConfig, IAppConfig } from '@/config/app.config';
import { databaseConfig, IDatabaseConfig } from '@/config/database.config';

export interface IConfig {
  app: IAppConfig;
  database: IDatabaseConfig;
}

export const config: IConfig = {
  app: appConfig,
  database: databaseConfig,
};
