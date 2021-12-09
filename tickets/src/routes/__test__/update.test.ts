import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
it('it retuns 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'dsadsa',
      price: 20,
    })
    .expect(404);
});
it('it retuns 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'dsadsa',
      price: 20,
    })
    .expect(401);
});
it('it retuns 401 if the user not own the ticket', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'dasdas', price: '344' });
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'hnhn', price: '3434' })
    .expect(401);
});

it('it retuns 400 if the user provid an invalid title or price', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'dasdas', price: '50' });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'hgfhgfh', price: -8 })

    .expect(400);
});
it('it update the ticket when provid valid inputs', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'dasdas', price: '50' });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'hgfhgfh', price: 85 })

    .expect(200);
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'dasdas', price: '50' });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'hgfhgfh', price: 85 })

    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects udpates if the ticket is reserved', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'dasdas', price: '50' });

  const ticket = await Ticket.findById(res.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'hgfhgfh', price: 85 })

    .expect(400);
});
