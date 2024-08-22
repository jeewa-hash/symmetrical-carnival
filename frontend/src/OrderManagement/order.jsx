import React, { useState } from 'react';

const initialOrder = {
  orderTotal: 0,
  orderItems: [{ name: '', quantity: 0 }],
  status: '', // Order status
  shopName: '', // New field for shop name
  orderDate: '', // New field for order date
};

const OrderCreation = () => {
  const [order, setOrder] = useState(initialOrder);
  const [orders, setOrders] = useState([]); // State to hold the list of all orders
  const [editIndex, setEditIndex] = useState(null); // Index of the order being edited

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
    newOrderItems[index].quantity = parseInt(event.target.value, 10);
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
    updatedOrders[index] = order; // Update the order at the specified index
    setOrders(updatedOrders);
    setOrder(initialOrder); // Reset the form
    setEditIndex(null); // Clear the edit index
  };

  const handleDeleteOrder = (index) => {
    const updatedOrders = orders.filter((_, i) => i !== index);
    setOrders(updatedOrders);
  };

  const calculateOrderTotal = () => {
    const total = order.orderItems.reduce((acc, item) => acc + item.quantity * 0, 0); // Removed price multiplication
    setOrder({ ...order, orderTotal: total });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    calculateOrderTotal();
    if (editIndex !== null) {
      handleUpdateOrder(editIndex);
    } else {
      setOrders([...orders, order]); // Add the current order to the list of orders
      setOrder(initialOrder); // Reset the form
    }
  };

  const handleEdit = (index) => {
    setOrder(orders[index]); // Set the form to the order being edited
    setEditIndex(index); // Set the edit index
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">{editIndex !== null ? 'Edit Order' : 'Order Creation'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shopName">
            Shop Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="shopName"
            type="text"
            value={order.shopName}
            onChange={handleShopNameChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orderDate">
            Order Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="orderDate"
            type="date"
            value={order.orderDate}
            onChange={handleOrderDateChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            Order Status
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="status"
            value={order.status}
            onChange={handleStatusChange}
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        {order.orderItems.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`itemName${index}`}>
                Item {index + 1} Name
              </label>
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={`itemName${index}`}
              type="text"
              value={item.name}
              onChange={(event) => handleItemNameChange(event, index)}
            />
            <div className="flex justify-between mt-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`itemQuantity${index}`}>
                Quantity
              </label>
            </div>
            <div className="flex justify-between">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={`itemQuantity${index}`}
                type="number"
                value={item.quantity}
                onChange={(event) => handleItemQuantityChange(event, index)}
              />
            </div>
          </div>
        ))}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleAddItem}
        >
          Add Item
        </button>
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orderTotal">
            Order Total
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="orderTotal"
            type="number"
            step="0.01"
            value={order.orderTotal}
            readOnly
          />
        </div>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {editIndex !== null ? 'Update Order' : 'Create Order'}
        </button>
      </form>

      {/* Display all created orders */}
      {orders.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 rounded shadow-md">
          <h3 className="text-xl font-bold mb-4">All Orders</h3>
          {orders.map((order, index) => (
            <div key={index} className="mb-4">
              <h4 className="text-lg font-bold mb-2">Order {index + 1}</h4>
              <p className="text-sm text-gray-700">Shop: {order.shopName}</p>
              <p className="text-sm text-gray-700">Date: {order.orderDate}</p>
              <p className="text-sm text-gray-700">Status: {order.status}</p>
              <h5 className="text-md font-bold mb-2">Order Items:</h5>
              <ul>
                {order.orderItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="mb-1">
                    {item.name} - {item.quantity}
                  </li>
                ))}
              </ul>
              <div className="flex space-x-2 mt-2">
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleDeleteOrder(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderCreation;
