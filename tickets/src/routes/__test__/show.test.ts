import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('returns 404 if the ticket not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app).get(`/api/tickets/${id}`).send();
  console.log(res.body);

  expect(res.status).toBe(404);
});

it('returns  the ticket if found', async () => {
  const title = ' some title for u';
  const price = 20;
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);
  expect(ticketRes.body.title).toEqual(title);
  expect(ticketRes.body.price).toEqual(price);
});
