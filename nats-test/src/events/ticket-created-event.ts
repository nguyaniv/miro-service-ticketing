import { Subjects } from './subjects';

export interface TicketCreactedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
