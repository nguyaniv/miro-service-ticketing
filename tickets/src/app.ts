import express from 'express';
import 'express-async-errors';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { udpateTicketRouter } from './routes/update';
import { errorHandler, NotFoundError, currentUser } from '@yystickets/common';
import cookieSession from 'cookie-session';
const app = express();
app.set('trust proxy', true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(udpateTicketRouter);
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
