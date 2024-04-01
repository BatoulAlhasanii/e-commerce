import { IMessageBroker } from '@/modules/message-broker/interfaces/message-broker.interface';

export class MockKafkaWrapper implements IMessageBroker {
  publish = jest.fn().mockImplementation(async (topic: string, data: any): Promise<void> => {
    // Mock implementation for the produce method
    // return Promise.resolve(undefined);
  });

  listen = jest.fn().mockImplementation(async (topic: string, instance: any): Promise<void> => {
    // Mock implementation for the consume method
  });
}
