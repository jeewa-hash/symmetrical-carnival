import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique IDs
import './order.css';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';

const initialOrder = {
  orderItems: [{ name: '', quantity: 0 }],
  status: '',
  shopName: '',
  orderDate: '',
  _id: '', // Add ID to the initialOrder
};

const OrderCreation = () => {
  const [order, setOrder] = useState(initialOrder);
  const [orders, setOrders] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const handleStatusChange = (event) => {
    setOrder({ ...order, status: event.target.value });
  };

  const handleShopNameChange = (event) => {
    setOrder({ ...order, shopName: event.target.value });
  };

  const handleOrderDateChange = (event) => {
    setOrder({ ...order, orderDate: event.target.value });
  };

  const handleItemNameChange = (event, index) => {
    const newOrderItems = [...order.orderItems];
    newOrderItems[index].name = event.target.value;
    setOrder({ ...order, orderItems: newOrderItems });
  };

  const handleItemQuantityChange = (event, index) => {
    const newOrderItems = [...order.orderItems];
    newOrderItems[index].quantity = Math.max(parseInt(event.target.value, 10) || 0, 0);
    setOrder({ ...order, orderItems: newOrderItems });
  };

  const handleAddItem = () => {
    setOrder({
      ...order,
      orderItems: [...order.orderItems, { name: '', quantity: 0 }],
    });
  };

  const handleUpdateOrder = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index] = order;
    setOrders(updatedOrders);
    setOrder(initialOrder);
    setEditIndex(null);
  };

  const calculateTotalQuantity = (orderItems) => {
    return orderItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  };

  const validateOrder = () => {
    let errors = {};

    if (!order.shopName.trim()) {
      errors.shopName = 'Shop name is required';
    }

    if (!order.orderDate) {
      errors.orderDate = 'Order date is required';
    }

    if (!order.status) {
      errors.status = 'Order status is required';
    }

    const itemErrors = order.orderItems.map((item, index) => {
      let error = {};
      if (!item.name.trim()) {
        error.name = `Item ${index + 1} name is required`;
      }
      if (item.quantity <= 0) {
        error.quantity = `Item ${index + 1} quantity must be greater than 0`;
      }
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
          handleUpdateOrder(editIndex);
        } else {
          const newOrder = { ...order, _id: uuidv4() }; // Generate a unique ID
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

  return (
    <div>
      <Header />
      <div className="order-creation-container">
        <button
          className="navigate-button"
          onClick={() => navigate('/another-page')}
        >
          View Orders
        </button>

        <h2 className="title">
          {editIndex !== null ? 'Edit Order' : 'Order Creation'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="shopName">
              Shop Name
            </label>
            <input
              className="form-input"
              id="shopName"
              type="text"
              value={order.shopName}
              onChange={handleShopNameChange}
              required
            />
            {validationErrors.shopName && (
              <span className="error-text">{validationErrors.shopName}</span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="orderDate">
              Order Date
            </label>
            <input
              className="form-input"
              id="orderDate"
              type="date"
              value={order.orderDate}
              onChange={handleOrderDateChange}
              min={today}
              required
            />
            {validationErrors.orderDate && (
              <span className="error-text">{validationErrors.orderDate}</span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">
              Order Status
            </label>
            <select
              className="form-select"
              id="status"
              value={order.status}
              onChange={handleStatusChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {validationErrors.status && (
              <span className="error-text">{validationErrors.status}</span>
            )}
          </div>
          {order.orderItems.map((item, index) => (
            <div key={index} className="form-group">
              <label className="form-label" htmlFor={`itemName${index}`}>
                Item {index + 1} Name
              </label>
              <input
                className="form-input"
                id={`itemName${index}`}
                type="text"
                value={item.name}
                onChange={(event) => handleItemNameChange(event, index)}
                required
              />
              {validationErrors.orderItems &&
                validationErrors.orderItems[index] &&
                validationErrors.orderItems[index].name && (
                  <span className="error-text">
                    {validationErrors.orderItems[index].name}
                  </span>
                )}
              <label className="form-label mt-2" htmlFor={`itemQuantity${index}`}>
                Quantity
              </label>
              <input
                className="form-input"
                id={`itemQuantity${index}`}
                type="number"
                value={item.quantity}
                onChange={(event) => handleItemQuantityChange(event, index)}
                min="1"
                required
              />
              {validationErrors.orderItems &&
                validationErrors.orderItems[index] &&
                validationErrors.orderItems[index].quantity && (
                  <span className="error-text">
                    {validationErrors.orderItems[index].quantity}
                  </span>
                )}
            </div>
          ))}
          <button
            className="add-item-button"
            type="button"
            onClick={handleAddItem}
          >
            Add Item
          </button>
          <div className="total-quantity-group mt-4">
            <label className="form-label" htmlFor="totalQuantity">
              Total Quantity
            </label>
            <input
              className="form-input"
              id="totalQuantity"
              type="number"
              value={calculateTotalQuantity(order.orderItems)}
              readOnly
            />
          </div>
          <button className="submit-button" type="submit">
            {editIndex !== null ? 'Update Order' : 'Create Order'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default OrderCreation;
