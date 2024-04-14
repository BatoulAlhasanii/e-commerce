import { IEvent } from '@/modules/message-broker/interfaces/event.interface';
import { IMessageBroker, MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';
import { Inject } from '@nestjs/common';

export abstract class BaseEventPublisher<T extends IEvent> {
  abstract subject: T['subject'];

  constructor(
    @Inject(MESSAGE_BROKER)
    private readonly messageBroker: IMessageBroker,
  ) {}

  async publish(data: T['data']): Promise<void> {
    await this.messageBroker.publish(this.subject, data);
  }
}
