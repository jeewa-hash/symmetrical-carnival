import React, { useState } from 'react';  
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

const availableItems = ['Bear', 'Bear With Heart', 'Dog', '5 Feet', 'Dalmation'];

const OrderCreation = () => {
  const [order, setOrder] = useState(initialOrder);
  const [orders, setOrders] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleStatusChange = (event) => {
    setOrder((prevOrder) => ({ ...prevOrder, status: event.target.value }));
  };

  const handleShopNameChange = (event) => {
    setOrder((prevOrder) => ({ ...prevOrder, shopName: event.target.value }));
  };

  const handleAddressChange = (event) => {
    const value = event.target.value;
    // Allow letters, digits, numbers, `/` character, and commas
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
                <option value="Processing">Processing</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
              {validationErrors.status && (
                <span className="text-red-500">{validationErrors.status}</span>
              )}
            </div>

            {order.orderItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <label htmlFor={`itemName${index}`} className="block text-lg font-semibold text-gray-700">Item {index + 1} Name</label>
                <select
                  id={`itemName${index}`}
                  value={item.name}
                  onChange={(event) => handleItemNameChange(event, index)}
                  required
                  className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select an item</option>
                  {availableItems.map((availableItem) => (
                    <option key={availableItem} value={availableItem}>
                      {availableItem}
                    </option>
                  ))}
                </select>
                {validationErrors.orderItems?.[index]?.name && (
                  <span className="text-red-500">{validationErrors.orderItems[index].name}</span>
                )}

                <label htmlFor={`itemQuantity${index}`} className="block text-lg font-semibold text-gray-700">Item {index + 1} Quantity</label>
                <input
                  id={`itemQuantity${index}`}
                  type="number"
                  value={item.quantity}
                  onChange={(event) => handleItemQuantityChange(event, index)}
                  onKeyDown={handleQuantityKeyDown}
                  required
                  className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {validationErrors.orderItems?.[index]?.quantity && (
                  <span className="text-red-500">{validationErrors.orderItems[index].quantity}</span>
                )}
              </div>
            ))}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200"
              >
                Add Item
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-black rounded-lg px-4 py-2 hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition duration-200"
              >
                {editIndex !== null ? 'Update Order' : 'Create Order'}
              </button>
            </div>
          </form>
        </div>
      </div>

     
    </div>
  );
};

export default OrderCreation;
