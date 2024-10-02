import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './oderbillcal.css'; // Ensure your CSS file reflects the new class names

const initialOrder = {
  orderItems: [{ name: '', quantity: 0, price: 0, totalPrice: 0 }],
  shopName: '',
  shopAddress: '',
  orderDate: new Date().toISOString().split('T')[0], // Default to today's date
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

  const handleInputChange = (event, field) => {
    let value = event.target.value;

    // Apply validation for the shopAddress field
    if (field === 'shopAddress') {
      // Allow letters, numbers, spaces, '/', and ',' characters
      value = value.replace(/[^a-zA-Z0-9/, ]/g, '');
    }
    

    setOrder({ ...order, [field]: value });
  };

  const handleItemChange = (event, index, field) => {
    const newOrderItems = [...order.orderItems];
    const value = field === 'quantity' ? Math.floor(parseFloat(event.target.value) || 0) : event.target.value;

    // Validate integer for quantity
    if (field === 'quantity' && (value < 0 || !Number.isInteger(Number(value)))) {
      return; // Ignore invalid input
    }

    newOrderItems[index][field] =
      field === 'quantity' || field === 'price'
        ? Math.max(value, 0) // Ensure value is non-negative
        : value;

    // Update total price for the item
    newOrderItems[index].totalPrice = newOrderItems[index].quantity * newOrderItems[index].price;

    setOrder({ ...order, orderItems: newOrderItems });
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
      newOrderItems.pop(); // Remove the last item
      setOrder({ ...order, orderItems: newOrderItems });
    }
  };

  const calculateTotalAmount = () => {
    return order.orderItems.reduce((acc, item) => acc + item.totalPrice, 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const totalAmount = calculateTotalAmount();
    const newOrder = { ...order, totalAmount }; // Use the default date stored in the order state

    try {
      const response = await axios.post('/api/billorder', newOrder);
      setOrders([...orders, response.data]);
      setMessage('Order created successfully!');
      setOrder(initialOrder); // Reset the form
    } catch (error) {
      console.error('Error saving order:', error);
      setMessage('Error creating order. Please try again.');
    }
  };

  return (
    <div>
      <div className="order-creation">
        <h2>Order Bill Creation</h2>
        <form onSubmit={handleSubmit}>
          <div className="order-creation__form-group">
            <label htmlFor="shopName">Shop Name</label>
            <input
              id="shopName"
              type="text"
              value={order.shopName}
              onChange={(e) => handleInputChange(e, 'shopName')}
              required
            />
          </div>
          <div className="order-creation__form-group">
            <label htmlFor="shopAddress">Shop Address</label>
            <input
              id="shopAddress"
              type="text"
              value={order.shopAddress}
              onChange={(e) => handleInputChange(e, 'shopAddress')}
            />
          </div>
          <div className="order-creation__form-group">
            <label htmlFor="orderDate">Order Date</label>
            <input
              id="orderDate"
              type="date"
              value={order.orderDate}
              readOnly // Make the date input read-only
              onFocus={(e) => e.target.blur()} // Prevent the date picker from opening.
            />
          </div>

          {/* Order Items Table */}
          <table className="order-creation__items-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price (Rs)</th> {/* Updated for Price */}
                <th>Total Price (Rs)</th> {/* Updated for Total Price */}
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <select
                      value={item.name}
                      onChange={(e) => handleItemChange(e, index, 'name')}
                      required
                    >
                      {itemOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(e, index, 'quantity')}
                      min="0"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(e, index, 'price')}
                      step="0.01"
                      min="0"
                      required
                    />
                  </td>
                  <td>Rs {item.totalPrice.toFixed(2)}</td> {/* Updated for Total Price */}
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={handleAddItem}>
            Add Item
          </button>
          <button type="button" onClick={handleCancelItem} disabled={order.orderItems.length <= 1}>
            Cancel Last Item
          </button>

          <div>Total Amount: Rs {calculateTotalAmount().toFixed(2)}</div> {/* Updated for Total Amount */}
          <button type="submit">Create Order Bill</button>
        </form>
        {message && <div className="order-creation__message">{message}</div>}
        <button onClick={() => navigate('/orders')}>View All Order Bills</button>
      </div>
    </div>
  );
};

export default OrderCreation;
