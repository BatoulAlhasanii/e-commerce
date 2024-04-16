export interface IRedisConfig {
  host: string;
  port: number;
}

export const redisConfig: IRedisConfig = {
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
};
