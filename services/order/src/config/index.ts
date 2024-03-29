import { appConfig, IAppConfig } from '@/config/app.config';
import { databaseConfig, IDatabaseConfig } from '@/config/database.config';
import { IJwtConfig, jwtConfig } from '@/config/jwt.config';
import { IKafkaConfig, kafkaConfig } from '@/config/kafka.config';

export interface IConfig {
  app: IAppConfig;
  database: IDatabaseConfig;
  jwt: IJwtConfig;
  kafka: IKafkaConfig;
}

export const config: IConfig = {
  app: appConfig,
  database: databaseConfig,
  jwt: jwtConfig,
  kafka: kafkaConfig,
};
