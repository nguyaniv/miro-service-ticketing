import React, { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.order.id,
    },
    onSuccess: (payment) => router.push('/orders/'),
  });
  const stripeKey =
    'pk_test_51K44kBJxYBpC0uuAGqrJDkALjmXgDjlbOhHAaDSfXwtIvLiwhoF6pFiaTTZvhi2byX4SP1NrzIPXHmy49cepEfXG00h1IN8Sdy';

  const ammout = order.order.ticket.price * order.order.ticket.quantity;
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);
  if (timeLeft < 0) {
    return <div className="order">Order expired</div>;
  }

  return (
    <div className="order">
      {timeLeft} seconds untill order expires
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={stripeKey}
        amount={ammout * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = await context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
