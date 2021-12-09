import request from 'supertest';
import { app } from '../../app';

it('successfully sign out after sign in', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'something@test.com', password: 'password' })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({ email: 'something@test.com', password: 'password' })
    .expect(200);

  const res = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
  expect(res.get('Set-Cookie')).toBeDefined();
});
