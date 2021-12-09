const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            title: {order.ticket.title} - status: {order.status}
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
