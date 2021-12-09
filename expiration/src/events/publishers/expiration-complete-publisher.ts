import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@yystickets/common';

export class ExpirationComplatePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplate;
}
