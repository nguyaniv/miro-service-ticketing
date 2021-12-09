import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'some title',
    price: 25,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  return ticket;
};

it('make sure order can be created and cancelled it', async () => {
  // create a ticket with Tickjet Model
  const user = global.signin();
  const ticket = await buildTicket();

  // make a request to create an order
  const {
    body: { order },
  } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order created event', async () => {
  const user = global.signin();
  const ticket = await buildTicket();

  // make a request to create an order
  const {
    body: { order },
  } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
