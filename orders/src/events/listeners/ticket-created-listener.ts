import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreactedEvent } from '@yystickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreactedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreactedEvent['data'], msg: Message) {
    const { title, price, id, date, location, quantity, description, image } =
      data;
    const ticket = Ticket.build({
      id,
      title,
      price,
      date,
      location,
      quantity,
      description,
      image,
    });
    await ticket.save();
    msg.ack();
  }
}
