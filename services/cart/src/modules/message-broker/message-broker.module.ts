import { Module } from '@nestjs/common';
import { KafkaWrapper } from '@/modules/message-broker/kafka-wrapper';
import { MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';

@Module({
  providers: [
    {
      provide: MESSAGE_BROKER,
      useClass: KafkaWrapper,
    },
  ],
  exports: [MESSAGE_BROKER],
})
export class MessageBrokerModule {}
