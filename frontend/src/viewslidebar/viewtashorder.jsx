import React, { useEffect, useState } from 'react';
import axios from 'axios';

import backgr from '../image/bbk.png';

const availableItems = [
  { id: 1, name: 'Teddy Bear' },
  { id: 2, name: 'Stuffed Elephant' },
  { id: 3, name: 'Plush Lion' },
  { id: 4, name: 'Bunny Rabbit' },
  { id: 5, name: 'Dinosaur' },
  { id: 6, name: 'Unicorn' },
];

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkedOrders, setCheckedOrders] = useState([]); // State to track checked orders

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/order');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Handle checkbox change - toggle checked state
  const handleCheckboxChange = (orderId) => {
    setCheckedOrders((prev) => {
      if (prev.includes(orderId)) {
        // If already checked, remove it
        return prev.filter((id) => id !== orderId);
      } else {
        // Otherwise, add it
        return [...prev, orderId];
      }
    });
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) =>
    order.shopName && order.shopName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="purple-500 min-h-screen">
      <div
        className="relative min-h-screen flex flex-col justify-center"
        style={{
          backgroundImage: `url(${backgr})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-4 text-black">Soft Toy Order List</h2>
          
          {loading ? (
            <div className="text-center text-white">Loading orders...</div>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-red-50 rounded-lg shadow-lg mb-4 p-4 border border-gray-300">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{order.shopName}</h3>
                      <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                    </div>
                    {/* Checkbox to track order selection */}
                    <input
                      type="checkbox"
                      checked={checkedOrders.includes(order._id)} // Check if order is in checkedOrders
                      onChange={() => handleCheckboxChange(order._id)} // Handle checkbox change
                      className="w-6 h-6 mt-2" // Style the checkbox
                    />
                  </div>
                  <h4 className="mt-4 font-semibold">Order Items:</h4>
                  <table className="min-w-full bg-white border border-gray-300 mt-2">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="py-2 px-4 border">Item Name</th>
                        <th className="py-2 px-4 border">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td className="py-2 px-4 border">{item.name}</td>
                          <td className="py-2 px-4 border">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
