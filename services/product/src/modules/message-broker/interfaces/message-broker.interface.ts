import { IEvent } from '@/modules/message-broker/interfaces/event.interface';
import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';

export const MESSAGE_BROKER: string = 'MESSAGE BROKER';

export interface IMessageBroker {
  publish: <T extends IEvent>(topic: T['subject'], data: T['data']) => Promise<void>;
  listen: <T extends IEvent>(topic: T['subject'], instance: BaseEventListener<T>) => Promise<void>;
}
