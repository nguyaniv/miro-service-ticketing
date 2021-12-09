import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';
jest.mock('../nats-wrapper');

declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // build a JWT payload {id,email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'mytest@gmail.com',
  };
  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // create sessio Object {jwt: MY_JWT}
  const session = { jwt: token };
  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
