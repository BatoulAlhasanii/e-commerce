import { appConfig, IAppConfig } from '@/config/app.config';
import { IKafkaConfig, kafkaConfig } from '@/config/kafka.config';

export interface IConfig {
  app: IAppConfig;
  kafka: IKafkaConfig;
}

export const config: IConfig = {
  app: appConfig,
  kafka: kafkaConfig,
};
