import { appConfig, IAppConfig } from '@/config/app.config';
import { databaseConfig, IDatabaseConfig } from '@/config/database.config';
import { IJwtConfig, jwtConfig } from '@/config/jwt.config';

export interface IConfig {
  app: IAppConfig;
  database: IDatabaseConfig;
  jwt: IJwtConfig;
}

export const config: IConfig = {
  app: appConfig,
  database: databaseConfig,
  jwt: jwtConfig,
};
