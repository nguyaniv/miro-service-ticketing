import { TicketUpdatedListener } from '../ticket-updated-listener';
import { TicketUpdatedEvent } from '@yystickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // createand save a tciekt
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'this is my test',
    price: 36,
  });
  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    userId: new mongoose.Types.ObjectId().toHexString(),
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    version: ticket.version + 1,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, ticket };
};

it('finds, update, and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('it acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('it does not call ack if the event has a skipped version number', async () => {
  const { msg, data, listener, ticket } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (error) {
    return;
  }
  expect(msg.ack).not.toHaveBeenCalled();
});
