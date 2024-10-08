import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RetrieveCartPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/cart'); // Ensure the endpoint is correct
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to retrieve orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Retrieve Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-md">
              <h2 className="text-xl font-semibold">Shop Name: {order.shopName || 'N/A'}</h2>
              <p className="text-gray-700">Shop Address: {order.shopAddress || 'N/A'}</p>
              <h3 className="font-semibold mt-2">Products:</h3>
              <ul className="list-disc ml-5">
                {order.products.map((product, index) => (
                  <li key={index}>
                    {product.name || 'Unknown Product'}: {product.quantity || 0}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RetrieveCartPage;
