import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './updateorderbill.css';

const itemOptions = [
  { value: '', label: 'Select Item' },
  { value: 'Toy Bear', label: 'Toy Bear' },
  { value: 'Toy Rabbit', label: 'Toy Rabbit' },
  { value: 'Stuffed Elephant', label: 'Stuffed Elephant' },
  { value: 'Toy Dog', label: 'Toy Dog' },
];

const EditOrderModal = ({ order, onClose, onUpdate }) => {
  const [updatedOrder, setUpdatedOrder] = useState(order);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  useEffect(() => {
    setUpdatedOrder(order);
  }, [order]);

  // Handle changes in quantity and automatically update the total price for each item
  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = updatedOrder.orderItems.map((item, i) => {
      if (i === index) {
        const updatedPrice = item.price * newQuantity; // Calculate the new total price for the item
        return { ...item, quantity: newQuantity, totalPrice: updatedPrice };
      }
      return item;
    });

    setUpdatedOrder({ ...updatedOrder, orderItems: updatedItems });
  };

  const handleAddItem = () => {
    if (!newItemName) return; // Do not add an empty item
    const newItem = {
      name: newItemName,
      quantity: newItemQuantity,
      price: 10, // Assuming a default price; replace with actual logic if needed
      totalPrice: newItemQuantity * 10 // Update total price
    };

    setUpdatedOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: [...prevOrder.orderItems, newItem],
    }));

    // Reset the input fields
    setNewItemName('');
    setNewItemQuantity(1);
  };

  // Calculate total amount of the order using the original order data
  const calculateTotalAmount = () => {
    return updatedOrder.orderItems.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`/api/billorder/${order._id}`, updatedOrder);
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="modal">
      <h2 className="text-xl font-semibold mb-4">Edit Order</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Shop Name:
          <input
            type="text"
            value={updatedOrder.shopName}
            readOnly // Set as read-only
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block mb-2">
          Shop Address:
          <input
            type="text"
            value={updatedOrder.shopAddress}
            readOnly // Set as read-only
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block mb-2">
          Order Date:
          <input
            type="date"
            value={updatedOrder.orderDate.split('T')[0]} // Format date for input
            readOnly // Set as read-only
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <h3 className="font-semibold mb-2">Order Items:</h3>
        {updatedOrder.orderItems.map((item, index) => (
          <div key={index} className="order-item mb-4">
            <p><strong>{item.name}</strong></p>
            <label className="block mb-2">
              Quantity:
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </label>
            <p>Price: Rs {item.price.toFixed(2)}</p>
            <p>Total: Rs {item.totalPrice.toFixed(2)}</p>
          </div>
        ))}
        {/* New Item Input Section */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Add New Item:</h4>
          <select
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="mr-2 w-1/2 p-2 border border-gray-300 rounded"
          >
            {itemOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
            className="mr-2 w-1/4 p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-green-500 text-white rounded px-4 py-2 mr-2"
          >
            Add Item
          </button>
        </div>
        {/* Display Total Amount */}
        <div className="font-bold mb-4">Total Amount: Rs {calculateTotalAmount()}</div>
        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 mr-2">
          Update Order
        </button>
        <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 rounded px-4 py-2">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditOrderModal;
