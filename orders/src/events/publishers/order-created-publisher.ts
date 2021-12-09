import { Publisher, Subjects, OrderCreactedEvent } from '@yystickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreactedEvent> {
  readonly subject = Subjects.OrderCreated;
}
