import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

export const amqpConnectionMock: Partial<AmqpConnection> = {
  async publish(
    _exchange: string,
    _routingKey: string,
    message: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: any,
  ) {
    return message?.model?.product;
  },
};
