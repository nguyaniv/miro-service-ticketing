import Link from 'next/link';
import Header from '../cmps/Header';
const Landing = ({ currentUser, tickets }) => {
  const onSetDate = (date) => {
    const newDate = date.slice(0, 10);
    return newDate;
  };
  const onSetTime = (date) => {
    const newTime = date.slice(11, 16);
    return newTime;
  };
  const ticketList = tickets.map((ticket) => {
    return (
      <div className="tickets__item" key={ticket.id}>
        <ul className="tickets__item--date">
          <li> {onSetDate(ticket.date)}</li>
          <li>at: {onSetTime(ticket.date)}</li>
        </ul>
        <ul className="tickets__item--details">
          <li>{ticket.title}</li>
          <li>{ticket.location}</li>
        </ul>
        <div>
          <Link href={`/tickets/[ticketId]`} as={`/tickets/${ticket.id}`}>
            <a>
              <button className="btn-primary">View Ticket</button>
            </a>
          </Link>
        </div>
      </div>
    );
  });

  return (
    <div>
      <Header />
      <h1 className="h1-tickets">Tickets</h1>
      <section className="tickets">{ticketList}</section>
    </div>
  );
};

Landing.getInitialProps = async (context, client, currentUser) => {
  try {
    const { data } = await client.get('/api/tickets');
    return { tickets: data };
  } catch (error) {
    console.log('couldnt fetch');
    return { tickets: 'error' };
  }
};

export default Landing;
