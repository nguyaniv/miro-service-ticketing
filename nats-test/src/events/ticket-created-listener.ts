import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreactedEvent } from './ticket-created-event';
import { Subjects } from './subjects';
export class TicketCreatedListener extends Listener<TicketCreactedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';
  onMessage(data: TicketCreactedEvent['data'], msg: Message) {
    msg.ack();
  }
}
