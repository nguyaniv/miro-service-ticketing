import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@yystickets/common';
import { Message } from 'node-nats-streaming';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'some title',
    price: 70,
    userId: 'dsadsa',
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { msg, data, ticket, listener, orderId };
};

it('updates the tickets,publishes an event and acks the message', async () => {
  const { msg, data, ticket, listener, orderId } = await setup();

  await listener.onMessage(data, msg);
  const udpatedTicket = await Ticket.findById(ticket.id);
  expect(udpatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
