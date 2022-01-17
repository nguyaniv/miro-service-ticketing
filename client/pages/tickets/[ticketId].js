import React from 'react';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';
import Image from 'next/image';
const TicketShow = ({ ticket }) => {
  const { price, title, date, location, quantity, description, image } = ticket;
  const router = useRouter();
  console.log(ticket);
  const pReady = description.slice(0, 200);
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      router.push('/orders/[orderId]', `/orders/${order.order.id}`);
    },
  });
  return (
    <section className="ticket">
      <div className="ticket__movie">
        {title}

        <Image width={309} height={478} src={image} />
        <p>{pReady}</p>
      </div>
      <div className="ticket__container">
        <li className="ticket__title">
          <h4>{title}</h4>
          <ul className="space-around">
            <li>
              {' '}
              <span>Resale Tickets:</span> <span> x {quantity} </span>{' '}
            </li>
            <li>${price}</li>
          </ul>
        </li>
        {errors}
        <li className="ticket__details">
          <span>{date} </span> <span> {location} </span>{' '}
        </li>

        <li className="ticket__total">
          {' '}
          <span>total</span> <span>${price * quantity}</span>
        </li>
        <button onClick={() => doRequest()} className="btn-primary">
          Purchase
        </button>
      </div>
    </section>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return {
    ticket: data,
  };
};
export default TicketShow;
