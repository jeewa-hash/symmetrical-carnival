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

const availableStatuses = [
{ id: 1, name: 'Pending' },
{ id: 2, name: 'Processing' },
{ id: 3, name: 'Completed' },
{ id: 4, name: 'Cancelled' },
];

const OrderList = () => {
const [orders, setOrders] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [selectedOrder, setSelectedOrder] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editFormData, setEditFormData] = useState({
  shopName: '',
  orderDate: '',
  status: '',
  orderItems: [],
});
const [selectedNewItem, setSelectedNewItem] = useState('');
const [newQuantity, setNewQuantity] = useState(1);
const [loading, setLoading] = useState(true);
const [showNewItemInput, setShowNewItemInput] = useState(false);

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





const handleSearchChange = (event) => {
  setSearchQuery(event.target.value);
};



const filteredOrders = orders.filter((order) =>
  order.shopName && order.shopName.toLowerCase().includes(searchQuery.toLowerCase())
);

const handleViewDetails = (order) => {
  setSelectedOrder(order);
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
  setSelectedOrder(null);
};

const handleEdit = (order) => {
  if (order.status === 'Completed' || order.status === 'Shipped') {
    alert('Order Completed');
    return;
  }

  const formattedOrderDate = new Date(order.orderDate).toISOString().split('T')[0];
  setEditFormData({
    ...order,
    orderDate: formattedOrderDate,
  });
  setIsEditModalOpen(true);
};

const handleEditChange = (event) => {
  const { name, value } = event.target;
  setEditFormData({
    ...editFormData,
    [name]: value,
  });
};

const handleEditItemsChange = (index, event) => {
  const { name, value } = event.target;
  const updatedItems = [...editFormData.orderItems];

  if (name === 'quantity') {
    // Allow only digits (0-9) and prevent any other characters
    if (/^\d*$/.test(value) || value === '') {
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: value ? parseInt(value, 10) : 0,
      };
    }
  } else {
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    };
  }

  setEditFormData({ ...editFormData, orderItems: updatedItems });
};

const handleAddNewItem = () => {
  const item = availableItems.find((item) => item.name === selectedNewItem);
  if (item) {
    setEditFormData((prevData) => ({
      ...prevData,
      orderItems: [
        ...prevData.orderItems,
        { name: item.name, quantity: newQuantity },
      ],
    }));
    setSelectedNewItem('');
    setNewQuantity(1);
    setShowNewItemInput(false);
  } else {
    alert('Please select a valid item.');
  }
};

const handleDeleteItem = (index) => {
  const updatedItems = editFormData.orderItems.filter((_, i) => i !== index);
  setEditFormData({ ...editFormData, orderItems: updatedItems });
};

const handleEditSubmit = async (event) => {
  event.preventDefault();

  const orderDate = new Date(editFormData.orderDate);
  if (isNaN(orderDate)) {
    alert('Please enter a valid date.');
    return;
  }

  try {
    const response = await axios.put(`/api/order/${editFormData._id}`, editFormData);
    if (response.status === 200) {
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === editFormData._id ? { ...order, ...editFormData } : order))
      );
      setIsEditModalOpen(false);
    }
  } catch (error) {
    console.error('Error updating order:', error);
    alert('Failed to update order. Please try again.');
  }
};

const handleDelete = async (orderId) => {
  const orderToDelete = orders.find((order) => order._id === orderId);
  if (orderToDelete && (orderToDelete.status === 'Completed' || orderToDelete.status === 'Shipped')) {
    alert('Order is already "Completed" or "Shipped."');
    return;
  }

  try {
    await axios.delete(`/api/order/${orderId}`);
    setOrders(orders.filter((order) => order._id !== orderId));
  } catch (error) {
    console.error('Error deleting order:', error);
    alert('Failed to delete order. Please try again.');
  }
};

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
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Shop Name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
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
                <div>
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="text-white bg-blue-500 rounded px-2 py-1 hover:bg-blue-600 transition duration-200"
                    aria-label={`View details for order from ${order.shopName}`}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEdit(order)}
                    className="ml-2 bg-yellow-500 text-white rounded px-2 py-1 hover:bg-yellow-600 transition duration-200"
                    aria-label={`Edit order from ${order.shopName}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="ml-2 bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 transition duration-200"
                    aria-label={`Delete order from ${order.shopName}`}
                  >
                    Delete
                  </button>
                </div>
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

    {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-4">Order Details</h3>
          {selectedOrder && (
            <>
              <p><strong>Shop Name:</strong> {selectedOrder.shopName}</p>
              <p><strong>Order Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <h4 className="mt-4 font-semibold">Order Items:</h4>
              <ul>
                {selectedOrder.orderItems.map((item, index) => (
                  <li key={index}>
                    {item.name} - Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
            </>
          )}
          <button
            onClick={handleCloseModal}
            className="mt-4 text-white bg-blue-500 rounded px-4 py-2"
          >
            Close
          </button>
        </div>
      </div>
    )}

    {isEditModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-4">Edit Order</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">Shop Name</label>
              <input
                type="text"
                name="shopName"
                value={editFormData.shopName}
                onChange={handleEditChange}
                readOnly
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                
              />
            </div>
            <div className="mb-4">
              <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700">Order Date</label>
              <input
                type="date"
                name="orderDate"
                value={editFormData.orderDate}
                onChange={handleEditChange}
                readOnly
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={editFormData.status}
                onChange={handleEditChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              >
                {availableStatuses.map((status) => (
                  <option key={status.id} value={status.name}>{status.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Order Items:</h4>
              {editFormData.orderItems.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    name="itemName"
                    value={item.name}
                    readOnly
                    className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none"
                  />
                  <input
                    type="text" // Change from type="number" to type="text"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleEditItemsChange(index, e)}
                    className="ml-2 w-1/4 p-2 border border-gray-300 rounded focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="ml-2 bg-red-500 text-white rounded px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {showNewItemInput ? (
                <div className="flex items-center mb-2">
                  <select
                    value={selectedNewItem}
                    onChange={(e) => setSelectedNewItem(e.target.value)}
                    className="w-1/2 p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select Item</option>
                    {availableItems.map((item) => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="ml-2 w-1/4 p-2 border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewItem}
                    className="ml-2 bg-green-500 text-white rounded px-2 py-1"
                  >
                    Add Item
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewItemInput(true)}
                  className="mt-2 text-blue-500"
                >
                  + Add New Item
                </button>
              )}
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white rounded px-4 py-2"
            >
              Update Order
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="mt-4 ml-2 bg-gray-300 text-gray-800 rounded px-4 py-2"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    )}
</div>
    
  </div>
);
};

export default OrderList;    