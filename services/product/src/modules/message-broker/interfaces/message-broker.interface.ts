import { IEvent } from '@/modules/message-broker/interfaces/event.interface';

export const MESSAGE_BROKER: string = 'MESSAGE BROKER';

export interface IMessageBroker {
  publish: <T extends IEvent>(
    topic: T['subject'],
    data: T['data'],
  ) => Promise<void>;
  listen: <T extends IEvent>(
    topic: T['subject'],
    callback: (data: T['data']) => Promise<void>,
  ) => Promise<void>;
}
