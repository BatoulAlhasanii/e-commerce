import { IEvent } from '@/modules/message-broker/interfaces/event.interface';

export abstract class BaseEventListener<T extends IEvent> {
  abstract subject: T['subject'];
  abstract handle(data: T['data']): Promise<void>;
}
