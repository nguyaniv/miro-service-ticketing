import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import mongoose from 'mongoose';
import { OrderStatus } from '@yystickets/common';
import { stripe } from '../../stripe';

jest.mock('../../stripe');
it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdas',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('it returns a 401 when purchasing an order that doesnt belogto the user', async () => {
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 35,
  });
  order.save();
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdas',
      orderId: order.id,
    })
    .expect(401);
});
it('it returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: userId,
    price: 35,
  });
  order.save();

  order.set({ status: OrderStatus.Cancelled });

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'asdas',
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 204 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: userId,
    price: 35,
  });
  order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ token: 'tok_visa', orderId: order.id })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(35 * 100);
  expect(chargeOptions.currency).toEqual('usd');
});
