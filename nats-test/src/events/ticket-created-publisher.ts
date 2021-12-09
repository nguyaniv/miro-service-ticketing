import { Publisher } from './base-publisher';
import { TicketCreactedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedPublisher extends Publisher<TicketCreactedEvent> {
  readonly subject = Subjects.TicketCreated;
}
