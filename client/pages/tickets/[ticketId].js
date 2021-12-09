import React from 'react';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const TicketShow = ({ ticket }) => {
  const { price, title } = ticket;
  const router = useRouter();

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
    <div>
      <h1>{title}</h1>
      <h4>{price}</h4>
      {errors}
      <button onClick={()=>doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
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
