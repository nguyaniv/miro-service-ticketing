import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'testme@test.com', password: 'password' })
    .expect(201);
});

it('retuns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'testmetest.com', password: 'password' })
    .expect(400);
});
it('retuns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'testme@test.com', password: '5' })
    .expect(400);
});
it('retuns a 400 with an missing email  password', async () => {
  return request(app).post('/api/users/signup').send({}).expect(400);
});

it('it disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'yaniv@test.com', password: 'password5' })
    .expect(201);
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'yaniv@test.com', password: 'password' })
    .expect(400);
});
it('sets a cookie after successful signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({ email: 'yaniv@test.com', password: 'password5' })
    .expect(201);

  expect(res.get('Set-Cookie')).toBeDefined();
});
