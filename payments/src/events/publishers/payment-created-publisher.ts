import { Subjects, Publisher, PaymentCreatedEvent } from '@yystickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
