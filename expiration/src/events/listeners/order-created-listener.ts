import { Listener, OrderCreactedEvent, Subjects } from '@yystickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
export class OrderCreatedListener extends Listener<OrderCreactedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreactedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
    msg.ack();
  }
}
