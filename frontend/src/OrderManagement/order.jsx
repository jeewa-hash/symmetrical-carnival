import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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

const availableItems = ['Bear', 'Bear With Heart', 'Dog', '5 Feet', 'Dalmation','Bunny Rabbit'];

const OrderCreation = () => {
  const [order, setOrder] = useState(initialOrder);
  const [orders, setOrders] = useState([]); // This will hold the retrieved orders
  const [editIndex, setEditIndex] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSlideViewOpen, setIsSlideViewOpen] = useState(false);
  const [checkedOrders, setCheckedOrders] = useState([]);
  const navigate = useNavigate();
  
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
              <label htmlFor="status" className="block text-lg font-semibold text-gray-700">Order Status</label>
              <select
                id="status"
                value={order.status}
                onChange={handleStatusChange}
                required
                className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              {validationErrors.status && (
                <span className="text-red-500">{validationErrors.status}</span>
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

            <div>
              <h3 className="text-lg font-semibold text-gray-700">Order Items</h3>
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 mb-2">
                  <select
                    value={item.name}
                    onChange={(event) => handleItemNameChange(event, index)}
                    required
                    className="w-1/2 h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Item</option>
                    {availableItems.map((availableItem, idx) => (
                      <option key={idx} value={availableItem}>{availableItem}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onKeyDown={handleQuantityKeyDown}
                    onChange={(event) => handleItemQuantityChange(event, index)}
                    placeholder="Quantity"
                    required
                    className="h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-1/4"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newOrderItems = order.orderItems.filter((_, i) => i !== index);
                      setOrder((prevOrder) => ({ ...prevOrder, orderItems: newOrderItems }));
                    }}
                    className="bg-red-500 text-white h-10 px-4 rounded-lg focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-green-500 text-white h-10 px-4 rounded-lg"
              >
                Add Item
              </button>
            </div>
            <div className="flex justify-between mt-4">
  <button
    type="button"
    onClick={handleCancel}
    className="bg-gray-300 h-10 px-4 rounded-lg"
  >
    Cancel
  </button>
  <button
    type="submit" // Make sure this button is still a submit type
    className="bg-blue-500 text-white h-10 px-4 rounded-lg"
  >
    {editIndex !== null ? 'Update Order' : 'Create Order'}
  </button>

  {/* Remove or modify the navigation button if necessary */}
  {/* This button is for viewing orders, keep it as needed */}
  <button
    type="button"
    onClick={() => navigate('/orderret')} // Navigate to the retrieve orders route
    className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2"
  >
    View
  </button>
</div>

          </form>
        </div>{/* Slide Bar for Orders */}
<div className={`fixed top-0 right-0 h-full bg-rose-200 shadow-lg transition-transform duration-300 ${isSlideViewOpen ? 'translate-x-0' : 'translate-x-full'} z-20`} style={{ width: '350px' }}>
  <button onClick={toggleSlideView} className="absolute top-4 left-4 text-xl">✖</button>
  <h2 className="text-2xl font-bold mb-5 border-b-2 border-rose-300 pb-2">🧸 Soft Toy Orders</h2>

  {/* Container for scrollable orders */}
  <ul className="p-4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
    {orders.map((orderItem) => (
      <li 
        key={orderItem._id} 
        className={`border border-gray-300 rounded-lg p-4 bg-gray-100 shadow-md flex flex-col mb-4 ${checkedOrders.includes(orderItem._id) ? 'blur' : ''}`}
      >
        {/* Shop Name and Address */}
        <div className="flex justify-between mb-2">
          <span className="font-semibold text-lg">{orderItem.shopName || 'N/A'}</span>
          <span className="text-gray-600">{orderItem.shopAddress || 'N/A'}</span>
        </div>
        
        {/* Products Section */}
        <h3 className="font-semibold mt-2">Products:</h3>
        <ul className="list-disc ml-5">
          {orderItem.products.map((product, index) => (
            <li key={index} className="text-gray-700">
              {product.name || 'Unknown Product'}: <span className="font-semibold">{product.quantity || 0}</span>
            </li>
          ))}
        </ul>
        
        {/* Checkbox for Selection */}
        <div className="mt-2">
          <input
            type="checkbox"
            checked={checkedOrders.includes(orderItem._id)}
            onChange={() => handleCheckboxChange(orderItem._id)}
          />
          <label className="ml-2">Select</label>
        </div>
      </li>
    ))}
  </ul>
</div>







        {/* Toggle Slide Bar Button */}
        <button onClick={toggleSlideView} className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full">
          Orders
        </button>
      </div>

      
    </div>
  );
};

export default OrderCreation;
