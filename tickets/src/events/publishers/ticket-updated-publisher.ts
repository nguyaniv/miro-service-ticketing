import { Publisher, Subjects, TicketUpdatedEvent } from '@yystickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
