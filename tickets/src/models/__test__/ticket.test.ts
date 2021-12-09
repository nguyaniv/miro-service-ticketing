import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'pc',
    price: 5022,
    userId: 'someguy',
  });
  // save the ticket to the database
  await ticket.save();
  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  // make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }
  throw new Error('should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'pc',
    price: 5022,
    userId: 'someguy',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  await ticket.save();
  expect(ticket.version).toEqual(3);
});
