import { Listener, OrderCreactedEvent, Subjects } from '@yystickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';
export class OrderCreatedListener extends Listener<OrderCreactedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreactedEvent['data'], msg: Message) {
    // find the tickjet that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // if no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // mark the ticket as being reserved by setting its orderId property
    ticket.set({
      orderId: data.id,
    });
    // save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      orderId: ticket.orderId,
      userId: ticket.userId,
      version: ticket.version,
    });
    // ack the message
    msg.ack();
  }
}
