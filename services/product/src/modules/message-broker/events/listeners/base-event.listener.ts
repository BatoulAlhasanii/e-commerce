import { IEvent } from '@/modules/message-broker/interfaces/event.interface';
import {
  IMessageBroker,
  MESSAGE_BROKER,
} from '@/modules/message-broker/interfaces/message-broker.interface';
import { Inject } from '@nestjs/common';

export abstract class BaseEventListener<T extends IEvent> {
  abstract subject: T['subject'];
  abstract handle(data: T['data']): void;

  constructor(
    @Inject(MESSAGE_BROKER)
    private readonly messageBroker: IMessageBroker,
  ) {}

  async listen(): Promise<void> {
    await this.messageBroker.listen(this.subject, this.handle);
  }
}
