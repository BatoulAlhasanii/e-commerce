import {
  Kafka,
  Consumer,
  EachMessagePayload,
  Partitioners,
  Producer,
  logLevel,
} from 'kafkajs';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { IMessageBroker } from '@/modules/message-broker/interfaces/message-broker.interface';
import { queueGroupName } from '@/modules/message-broker/queue-group-name';
import { ConfigService } from '@nestjs/config';
import { IEvent } from '@/modules/message-broker/interfaces/event.interface';

@Injectable()
export class KafkaWrapper
  implements IMessageBroker, OnModuleInit, OnModuleDestroy
{
  protected _kafka?: Kafka;
  protected _producer?: Producer;
  protected _consumers?: Consumer[] = [];

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this._kafka = new Kafka({
      clientId: this.configService.get('kafka.clientId'),
      brokers: [this.configService.get('kafka.broker')],
      logLevel: logLevel.INFO,
    });

    await this.connectProducer();
  }

  private async connectProducer() {
    if (!this._kafka) {
      throw new Error('Kafka is not configured');
    }

    this._producer = this._kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });

    await this._producer.connect();
  }

  async publish<T extends IEvent>(
    topic: T['subject'],
    data: T['data'],
  ): Promise<void> {
    await this._producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(data) }],
    });
  }

  async listen<T extends IEvent>(
    topic: T['subject'],
    callback: (data: T['data']) => Promise<void>,
  ): Promise<void> {
    const consumer: Consumer = this._kafka.consumer({
      groupId: queueGroupName,
    });

    this._consumers.push(consumer);

    await consumer.connect();

    await consumer!.subscribe({ topic, fromBeginning: true });

    await consumer!.run({
      autoCommit: false,
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        const parsedData = this.parseMessage(message.value);

        await callback(parsedData);

        await consumer.commitOffsets([
          { topic, partition, offset: message.offset },
        ]);
      },
    });
  }

  private parseMessage(data: any) {
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }

  async onModuleDestroy(): Promise<void> {
    if (this._producer) {
      await this._producer.disconnect();
    }

    if (this._consumers.length) {
      await Promise.all(
        this._consumers.map((consumer: Consumer) => consumer.disconnect()),
      );
    }
  }
}
