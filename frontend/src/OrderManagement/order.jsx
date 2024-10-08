import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import backgroundImage from '../image/design.png'; // Adjust the path according to your folder structure

// Initialize order with today's date
const today = new Date();
const formattedDate = today.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

const initialOrder = {
  orderItems: [{ name: '', quantity: '' }],
  status: '',
  shopName: '',
  orderDate: formattedDate, // Set today's date as default
  address: '', // Add address field
  _id: '',
};

const availableItems = ['Bear', 'Bear With Heart', 'Dog', '5 Feet', 'Dalmation'];

const OrderCreation = () => {
  const [order, setOrder] = useState(initialOrder);
  const [orders, setOrders] = useState([]); // This will hold the retrieved orders
  const [editIndex, setEditIndex] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSlideViewOpen, setIsSlideViewOpen] = useState(false);
  const [checkedOrders, setCheckedOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/cart'); // Ensure the endpoint is correct
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  // Slide View Toggle Function
  const toggleSlideView = () => {
    setIsSlideViewOpen(!isSlideViewOpen);
  };

  const handleCheckboxChange = (orderId) => {
    setCheckedOrders((prevChecked) => 
      prevChecked.includes(orderId) 
        ? prevChecked.filter((id) => id !== orderId) 
        : [...prevChecked, orderId]
    );
  };

  const handleStatusChange = (event) => {
    setOrder((prevOrder) => ({ ...prevOrder, status: event.target.value }));
  };

  const handleShopNameChange = (event) => {
    setOrder((prevOrder) => ({ ...prevOrder, shopName: event.target.value }));
  };

  const handleAddressChange = (event) => {
    const value = event.target.value;
    const regex = /^[A-Za-z0-9\/,\s]*$/; // Updated regex to allow commas
    if (regex.test(value)) {
      setOrder((prevOrder) => ({ ...prevOrder, address: value }));
    }
  };

  const handleItemNameChange = (event, index) => {
    setOrder((prevOrder) => {
      const newOrderItems = [...prevOrder.orderItems];
      newOrderItems[index].name = event.target.value;
      return { ...prevOrder, orderItems: newOrderItems };
    });
  };

  const handleItemQuantityChange = (event, index) => {
    const quantityValue = event.target.value;
    setOrder((prevOrder) => {
      const newOrderItems = [...prevOrder.orderItems];
      if (quantityValue === '' || /^[1-9][0-9]*$/.test(quantityValue)) {
        newOrderItems[index].quantity = quantityValue;
      }
      return { ...prevOrder, orderItems: newOrderItems };
    });
  };

  const handleAddItem = () => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: [...prevOrder.orderItems, { name: '', quantity: '' }],
    }));
  };

  const validateOrder = () => {
    let errors = {};
    if (!order.shopName.trim()) errors.shopName = 'Shop name is required';
    if (!order.orderDate) errors.orderDate = 'Order date is required';
    if (!order.status) errors.status = 'Order status is required';
    if (!order.address.trim()) errors.address = 'Address is required';

    const itemErrors = order.orderItems.map((item, index) => {
      let error = {};
      if (!item.name.trim()) error.name = `Item ${index + 1} name is required`;
      if (item.quantity === '' || item.quantity <= 0) error.quantity = `Item ${index + 1} quantity must be greater than 0`;
      return error;
    });

    if (itemErrors.some((itemError) => itemError.name || itemError.quantity)) {
      errors.orderItems = itemErrors;
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateOrder();
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        if (editIndex !== null) {
          const updatedOrders = [...orders];
          updatedOrders[editIndex] = order;
          setOrders(updatedOrders);
          setOrder(initialOrder);
          setEditIndex(null);
        } else {
          const newOrder = { ...order, _id: uuidv4() };
          const response = await axios.post('/api/order', newOrder);
          if (response.status === 201) {
            setOrders([...orders, response.data]);
            setOrder(initialOrder);
            alert('Order created successfully!');
          }
        }
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Failed to create order. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setOrder(initialOrder);
    setValidationErrors({});
  };

  const handleQuantityKeyDown = (event) => {
    if (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key === 'Tab' ||
      event.key === 'Escape' ||
      event.key === 'Enter' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight'
    ) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

 
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
    <div className="flex flex-col min-h-screen relative">
      <Header />

      <div
        className="flex-1 flex justify-center items-center bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-xl w-full bg-pink-100 bg-opacity-80 backdrop-blur-lg rounded-lg shadow-xl p-10 border border-gray-200 space-y-6 z-10">
          <h2 className="text-4xl font-bold text-purple-600 mb-4 text-center">
            {editIndex !== null ? 'Edit Order' : 'Order Creation'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="shopName" className="block text-lg font-semibold text-gray-700">Shop Name</label>
              <input
                id="shopName"
                type="text"
                value={order.shopName}
                onChange={handleShopNameChange}
                required
                className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {validationErrors.shopName && (
                <span className="text-red-500">{validationErrors.shopName}</span>
              )}
            </div>

            <div>
              <label htmlFor="orderDate" className="block text-lg font-semibold text-gray-700">Order Date</label>
              <input
                id="orderDate"
                type="date"
                value={order.orderDate}
                readOnly
                required
                className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {validationErrors.orderDate && (
                <span className="text-red-500">{validationErrors.orderDate}</span>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-lg font-semibold text-gray-700">Address</label>
              <input
                id="address"
                type="text"
                value={order.address}
                onChange={handleAddressChange}
                required
                className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {validationErrors.address && (
                <span className="text-red-500">{validationErrors.address}</span>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Order Items</h3>
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <select
                    value={item.name}
                    onChange={(e) => handleItemNameChange(e, index)}
                    className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg"
                    required
                  >
                    <option value="" disabled>Select Item</option>
                    {availableItems.map((availableItem) => (
                      <option key={availableItem} value={availableItem}>{availableItem}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemQuantityChange(e, index)}
                    onKeyDown={handleQuantityKeyDown}
                    className="w-24 h-10 border border-gray-300 p-1 bg-white rounded-lg"
                    required
                  />
                  {validationErrors.orderItems && validationErrors.orderItems[index]?.quantity && (
                    <span className="text-red-500">{validationErrors.orderItems[index].quantity}</span>
                  )}
                  {validationErrors.orderItems && validationErrors.orderItems[index]?.name && (
                    <span className="text-red-500">{validationErrors.orderItems[index].name}</span>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="text-white bg-purple-600 hover:bg-purple-700 rounded-lg px-4 py-2"
              >
                Add Item
              </button>
            </div>

            <div>
              <label htmlFor="status" className="block text-lg font-semibold text-gray-700">Status</label>
              <select
                id="status"
                value={order.status}
                onChange={handleStatusChange}
                required
                className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg"
              >
                <option value="" disabled>Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
              </select>
              {validationErrors.status && (
                <span className="text-red-500">{validationErrors.status}</span>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="text-white bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2"
              >
                {editIndex !== null ? 'Update Order' : 'Create Order'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Slide-in view for orders */}
      <div className={`fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg transition-transform duration-300 ${isSlideViewOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={toggleSlideView} className="p-4 text-red-600">Close</button>
        <h2 className="text-xl font-semibold text-gray-700 p-4">Cart Orders</h2>
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

      <button onClick={toggleSlideView} className="fixed bottom-4 right-4 bg-purple-600 text-white rounded-full p-4 shadow-lg">
        Cart
      </button>

      <Footer />
    </div>
  );
};

export default OrderCreation;
