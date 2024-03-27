export const MESSAGE_BROKER: string = 'MESSAGE BROKER';

export interface IMessageBroker {
  publish: (topic: string, data: any) => Promise<void>;
  listen: (topic: string, callback: Function) => Promise<void>;
}
