import express, { Request, Response } from 'express';
import {
  NotFoundError,
  validateRequest,
  requireAuth,
  notAuthorizedError,
  BadRequestError,
} from '@yystickets/common';
import { Ticket } from '../models/ticket';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('quantity')
      .isFloat({ gt: 0 })
      .withMessage('Quantity must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError('ticket is reserved');
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new notAuthorizedError();
    }
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      quantity: ticket.quantity,
      userId: ticket.userId,
      version: ticket.version,
      date: ticket.date,
      location: ticket.location,
      description: ticket.description,
      image: ticket.image,
    });
    res.send(ticket);
  }
);

export { router as udpateTicketRouter };
