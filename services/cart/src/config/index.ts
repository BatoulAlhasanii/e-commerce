import { appConfig, IAppConfig } from '@/config/app.config';
import { IJwtConfig, jwtConfig } from '@/config/jwt.config';
import { IKafkaConfig, kafkaConfig } from '@/config/kafka.config';
import { IRedisConfig, redisConfig } from '@/config/redis.config';

export interface IConfig {
  app: IAppConfig;
  jwt: IJwtConfig;
  kafka: IKafkaConfig;
  redis: IRedisConfig;
}

export const config: IConfig = {
  app: appConfig,
  jwt: jwtConfig,
  kafka: kafkaConfig,
  redis: redisConfig,
};
