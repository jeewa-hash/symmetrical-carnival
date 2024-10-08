import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgr from '../image/design.png';

const initialOrder = {
  orderItems: [{ name: '', quantity: 0, price: 0, totalPrice: 0 }],
  shopName: '',
  shopAddress: '',
  orderDate: new Date().toISOString().split('T')[0],
  totalAmount: 0,
};

const itemOptions = [
  { value: '', label: 'Select Item' },
  { value: 'Toy Bear', label: 'Toy Bear' },
  { value: 'Toy Rabbit', label: 'Toy Rabbit' },
  { value: 'Stuffed Elephant', label: 'Stuffed Elephant' },
  { value: 'Toy Dog', label: 'Toy Dog' },
];

const OrderCreation = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(initialOrder);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [isSlideViewOpen, setIsSlideViewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkedOrders, setCheckedOrders] = useState([]);

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

  const handleInputChange = (event, field) => {
    let value = event.target.value;
    if (field === 'shopAddress') {
      value = value.replace(/[^a-zA-Z0-9/, ]/g, '');
    }
    setOrder({ ...order, [field]: value });
  };

  const handleItemChange = (event, index, field) => {
    const newOrderItems = [...order.orderItems];
    const value = field === 'quantity' ? Math.floor(parseFloat(event.target.value) || 0) : event.target.value;

    if (field === 'quantity' && (value < 0 || !Number.isInteger(Number(value)))) {
      return;
    }
    newOrderItems[index][field] = field === 'quantity' || field === 'price' ? Math.max(value, 0) : value;
    newOrderItems[index].totalPrice = newOrderItems[index].quantity * newOrderItems[index].price;
    setOrder({ ...order, orderItems: newOrderItems });
  };

  const handleShopNameKeyPress = async (event) => {
    if (event.key === 'Enter') {
      const shopName = event.target.value.trim();
      try {
        const response = await axios.get(`/api/order?shopName=${shopName}`);
        const shopData = response.data;
        if (shopData.length > 0) {
          const fetchedShop = shopData[0];
          setOrder({
            ...order,
            shopName: fetchedShop.shopName,
            shopAddress: fetchedShop.address,
          });
        } else {
          setMessage('Shop not found. Please check the shop name.');
        }
      } catch (error) {
        console.error('Error fetching shop details:', error);
        setMessage('Error fetching shop details. Please try again.');
      }
    }
  };

  const handleAddItem = () => {
    setOrder({
      ...order,
      orderItems: [...order.orderItems, { name: '', quantity: 0, price: 0, totalPrice: 0 }],
    });
  };

  const handleCancelItem = () => {
    if (order.orderItems.length > 1) {
      const newOrderItems = [...order.orderItems];
      newOrderItems.pop();
      setOrder({ ...order, orderItems: newOrderItems });
    }
  };

  const calculateTotalAmount = () => {
    return order.orderItems.reduce((acc, item) => acc + item.totalPrice, 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const totalAmount = calculateTotalAmount();
    const newOrder = { ...order, totalAmount };
    try {
      const response = await axios.post('/api/billorder', newOrder);
      setOrders([...orders, response.data]);
      setMessage('Order created successfully!');
      setOrder(initialOrder);
    } catch (error) {
      console.error('Error saving order:', error);
      setMessage('Error creating order. Please try again.');
    }
  };

  const toggleSlideView = () => {
    setIsSlideViewOpen(!isSlideViewOpen);
  };

  const handleCheckboxChange = (orderId) => {
    setCheckedOrders((prevCheckedOrders) => 
      prevCheckedOrders.includes(orderId) 
        ? prevCheckedOrders.filter((id) => id !== orderId) // Uncheck
        : [...prevCheckedOrders, orderId] // Check
    );
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.shopName &&
      order.shopName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      order.status === 'Completed'
  );
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  
 // Separate checked and unchecked orders
const uncheckedOrders = filteredOrders.filter((order) => !checkedOrders.includes(order._id));
const checkedOrdersList = filteredOrders.filter((order) => checkedOrders.includes(order._id));

// Combine unchecked and checked orders
const combinedOrders = [...uncheckedOrders, ...checkedOrdersList];

  return (
    <div className="relative">
      <div className="bg-cover bg-center min-h-screen" style={{ backgroundImage: `url(${backgr})` }}>
        <div className={`order-creation max-w-3xl mx-auto p-6 bg-white/70 backdrop-blur-sm shadow-lg rounded-lg mt-8 transition-all duration-300 ${isSlideViewOpen ? 'md:mr-80' : ''}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Order Bill Creation</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="order-creation__form-group">
              <label htmlFor="shopName" className="block text-gray-700 font-semibold">Shop Name</label>
              <input
                id="shopName"
                type="text"
                value={order.shopName}
                onChange={(e) => handleInputChange(e, 'shopName')}
                onKeyPress={handleShopNameKeyPress}
                required
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="order-creation__form-group">
              <label htmlFor="shopAddress" className="block text-gray-700 font-semibold">Shop Address</label>
              <input
                id="shopAddress"
                type="text"
                value={order.shopAddress}
                onChange={(e) => handleInputChange(e, 'shopAddress')}
                className="w-full p-2 bg-gray-100 rounded-md"
              />
            </div>
            <div className="order-creation__form-group">
              <label htmlFor="orderDate" className="block text-gray-700 font-semibold">Order Date</label>
              <input
                id="orderDate"
                type="date"
                value={order.orderDate}
                readOnly
                onFocus={(e) => e.target.blur()}
                className="w-full p-2 bg-gray-100 rounded-md"
              />
            </div>

            {/* Order Items Table */}
            <table className="order-creation__items-table w-full mt-4 bg-white border rounded-md shadow-sm">
              <thead>
                <tr className="bg-blue-100 text-left text-gray-700">
                  <th className="p-2">Item Name</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Price (Rs)</th>
                  <th className="p-2">Total Price (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">
                      <select
                        value={item.name}
                        onChange={(e) => handleItemChange(e, index, 'name')}
                        required
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        {itemOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(e, index, 'quantity')}
                        min="0"
                        required
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemChange(e, index, 'price')}
                        min="0"
                        required
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      />
                    </td>
                    <td className="p-2">{item.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="order-creation__buttons flex justify-between mt-4">
              <button
                type="button"
                onClick={handleAddItem}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
              >
                Add Item
              </button>
              <button
                type="button"
                onClick={handleCancelItem}
                disabled={order.orderItems.length === 1}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
              >
                Cancel Item
              </button>
            </div>

            <div className="order-creation__form-group mt-4">
              <label htmlFor="totalAmount" className="block text-gray-700 font-semibold">Total Amount</label>
              <input
                id="totalAmount"
                type="number"
                value={calculateTotalAmount()}
                readOnly
                className="w-full p-2 bg-gray-100 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Submit Order
            </button>
            {message && <p className="text-red-600 mt-4">{message}</p>}
            <button onClick={() => navigate('/orders')} className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400">
        View All Order Bills
      </button>
          </form>
        </div>

     {/* Slide-in View */}
<div className={`fixed inset-y-0 right-0 w-80 bg-gradient-to-b from-pink-200 to-rose-400 text-rose-900 transform ${isSlideViewOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out shadow-2xl rounded-l-lg`}>
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-5 border-b-2 border-rose-300 pb-2">🧸 Soft Toy Orders</h2>

    {loading ? (
      <p className="text-center text-rose-500">Fetching your cute orders...</p>
    ) : (
      <ul className="space-y-6">
        {combinedOrders.length === 0 ? (
          <li className="text-center text-rose-500">No soft toy orders found.</li>
        ) : (
          combinedOrders.map((order) => (
            <li key={order._id} className={`bg-white bg-opacity-60 p-4 rounded-lg ${checkedOrders.includes(order._id) ? 'opacity-60' : ''}`}>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={checkedOrders.includes(order._id)}
                  onChange={() => handleCheckboxChange(order._id)}
                  className="w-5 h-5 text-pink-500 rounded-full border-rose-300 focus:ring-pink-300"
                />
                <div className="ml-3 text-rose-900">
                  <span className="block text-lg font-semibold">Shop: {order.shopName}</span>
                  <span className="text-xs text-rose-600">Order Date: {formatDate(order.orderDate)}</span><br />
                  <span className="text-xs text-rose-600">Status: {order.status}</span>
                </div>
              </div>
              <ul className="space-y-1 ml-8">
                {order.orderItems.map((item, idx) => (
                  <li key={idx} className="text-sm text-rose-800">
                    <span>• {item.name} - Qty: {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
    )}
  </div>
</div>

       {/* Toggle Button */}
<button
  onClick={toggleSlideView}
  className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
>
  {isSlideViewOpen ? 'Close Orders' : 'View Orders'}
</button>


      </div>
    </div>
  );
};

export default OrderCreation;
