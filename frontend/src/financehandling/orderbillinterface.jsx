import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './oderbillcal.css'; // Ensure your CSS file reflects the new class names
import Orderret from '../viewslidebar/viewtashorder';

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
  const [isSlideViewOpen, setIsSlideViewOpen] = useState(false);

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

  const handleShopNameKeyPress = async (event) => {
    if (event.key === 'Enter') {
      const shopName = event.target.value.trim();

      try {
        const response = await axios.get(`/api/order?shopName=${shopName}`);
        const shopData = response.data;

        if (shopData.length > 0) {
          const fetchedShop = shopData[0];

          // Update order with fetched shop details
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
    const newOrder = { ...order, totalAmount };

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

  const toggleSlideView = () => {
    setIsSlideViewOpen(!isSlideViewOpen);
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
              onKeyPress={handleShopNameKeyPress}
              required
            />
          </div>
          <div className="order-creation__form-group">
            <label htmlFor="shopAddress">Shop Address</label>
            <input
              id="shopAddress"
              type="text"
              value={order.shopAddress}
              readOnly
            />
          </div>
          <div className="order-creation__form-group">
            <label htmlFor="orderDate">Order Date</label>
            <input
              id="orderDate"
              type="date"
              value={order.orderDate}
              readOnly
              onFocus={(e) => e.target.blur()} // Prevent the date picker from opening.
            />
          </div>

          {/* Order Items Table */}
          <table className="order-creation__items-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price (Rs)</th>
                <th>Total Price (Rs)</th>
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
                  <td>Rs {item.totalPrice.toFixed(2)}</td>
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

          <div>Total Amount: Rs {calculateTotalAmount().toFixed(2)}</div>
          <button type="submit">Create Order Bill</button>
        </form>
        {message && <div className="order-creation__message">{message}</div>}
        <button onClick={() => navigate('/orders')}>View All Order Bills</button>
        <button onClick={toggleSlideView} className="mt-2 bg-blue-300 text-black px-4 py-2 rounded hover:bg-blue-400">
        View Orders
      </button>

      {/* Slide View for Orderret */}
      {isSlideViewOpen && (
        <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white w-96 h-full shadow-lg overflow-y-auto">
            
            {/* Close button bar */}
            <div className="flex justify-between items-center bg-gray-100 p-4 border-b">
              <h2 className="text-lg font-semibold">Orders</h2>
              <button
                onClick={toggleSlideView}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>

            {/* Slide content */}
            <div className="p-4">
              <Orderret />
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
};

export default OrderCreation;
