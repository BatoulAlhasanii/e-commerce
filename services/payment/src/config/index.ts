import { appConfig, IAppConfig } from '@/config/app.config';
import { databaseConfig, IDatabaseConfig } from '@/config/database.config';
import { IJwtConfig, jwtConfig } from '@/config/jwt.config';
import { IKafkaConfig, kafkaConfig } from '@/config/kafka.config';
import { IStripeConfig, stripeConfig } from '@/config/stripe.config';

export interface IConfig {
  app: IAppConfig;
  database: IDatabaseConfig;
  jwt: IJwtConfig;
  kafka: IKafkaConfig;
  stripe: IStripeConfig;
}

export const config: IConfig = {
  app: appConfig,
  database: databaseConfig,
  jwt: jwtConfig,
  kafka: kafkaConfig,
  stripe: stripeConfig,
};
