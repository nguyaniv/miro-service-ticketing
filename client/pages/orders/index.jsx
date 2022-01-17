const OrderIndex = ({ orders }) => {
  console.log(orders);
  return (
    <ul className="orders">
      <li className="order">
        <div className="order__menu">idx</div>
        <div className="order__menu">title</div>
        <div className="order__menu">status</div>
        <div className="order__menu">date</div>
        <div className="order__menu">location</div>
        <div className="order__menu">price</div>
      </li>
      {orders.map((order, i) => {
        return (
          <li className="order" key={order.id}>
            <div className="order__title"> {i}</div>
            <div className="order__title"> {order.ticket.title}</div>
            <div className="order__status">{order.status}</div>
            <div className="order__date">{order.ticket.date}</div>
            <div className="order__date">{order.ticket.location}</div>
            <div className="order__date">
              ${order.ticket.price * order.ticket.quantity}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');
  const { orders } = data;

  return { orders };
};

export default OrderIndex;
