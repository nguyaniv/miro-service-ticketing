import { Publisher, Subjects, TicketCreactedEvent } from '@yystickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreactedEvent> {
  readonly subject = Subjects.TicketCreated;
}
