import { appConfig, IAppConfig } from '@/config/app.config';
import { IKafkaConfig, kafkaConfig } from '@/config/kafka.config';
import {IRedisConfig, redisConfig} from "@/config/redis.config";

export interface IConfig {
  app: IAppConfig;
  kafka: IKafkaConfig;
  redis: IRedisConfig;
}

export const config: IConfig = {
  app: appConfig,
  kafka: kafkaConfig,
  redis: redisConfig,
};
