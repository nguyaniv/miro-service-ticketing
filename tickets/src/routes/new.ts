import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@yystickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('quantity')
      .isFloat({ gt: 0 })
      .withMessage('Quantity must be greater than 0'),
    body('date').not().isEmpty().withMessage('Date is required'),
    body('location').not().isEmpty().withMessage('location is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, date, location, quantity, description, image } =
      req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
      date,
      location,
      quantity,
      description,
      image,
    });
    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
      quantity: ticket.quantity,
      version: ticket.version,
      date: ticket.date,
      location: ticket.location,
      description: ticket.description,
      image: ticket.image,
    });
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
