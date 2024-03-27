export interface IKafkaConfig {
  clientId: string;
  broker: string;
}

export const kafkaConfig: IKafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID,
  broker: process.env.KAFKA_BROKER,
};
