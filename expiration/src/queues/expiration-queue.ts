import Queue from 'bull';
import { ExpirationComplatePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';
interface Payload {
  orderId: string;
}
const expirationQueue = new Queue<Payload>('order:Expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationComplatePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
