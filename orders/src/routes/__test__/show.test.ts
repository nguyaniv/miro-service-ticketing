import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
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

it('fetches the order', async () => {
  // Create a ticket
  const ticketOne = await buildTicket();
  const user = global.signin();

  // make a request to build an order with this ticket
  const {
    body: { order },
  } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // make request to fetch the order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);
  expect(fetchedOrder.order.id).toEqual(order.id);

  // fail to fetch if try to fetch from diff user
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
