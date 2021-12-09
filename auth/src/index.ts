import mongoose from 'mongoose';
import { app } from './app';
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('process.env.MONGO_URI must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Mongo connected');
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log('Auth Service Listening on 3000');
  });
};
start();
