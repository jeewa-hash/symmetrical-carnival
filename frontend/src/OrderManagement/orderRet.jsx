import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import './order.css'; // Import the CSS file
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';

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
    orderItems: []
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/order');
        console.log('Orders fetched:', response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredOrders = orders.filter((order) =>
    order.shopName.toLowerCase().includes(searchQuery.toLowerCase())
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
    setEditFormData({
      shopName: order.shopName,
      orderDate: order.orderDate,
      status: order.status,
      orderItems: order.orderItems
    });
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditItemsChange = (index, event) => {
    const { name, value } = event.target;
    const updatedItems = [...editFormData.orderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value
    };
    setEditFormData({ ...editFormData, orderItems: updatedItems });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('Submitting edit for order ID:', selectedOrder._id);
      const response = await axios.put(`/api/order/${selectedOrder._id}`, editFormData);
      console.log('Update response:', response);
      
      if (response.status === 200) {
        setOrders(
          orders.map(order =>
            order._id === selectedOrder._id ? { ...order, ...editFormData } : order
          )
        );
        handleCloseEditModal();
      } else {
        console.error('Failed to update order:', response);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditFormData({
      shopName: '',
      orderDate: '',
      status: '',
      orderItems: []
    });
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`/api/order/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="order-list-container">
        <h2 className="title">Order List</h2>
        <div className="search-group mt-8">
          <input
            className="form-input"
            type="text"
            placeholder="Search by Shop Name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {filteredOrders.length > 0 && (
          <div className="orders-table-container mt-8 p-4 bg-gray-100 rounded shadow-md">
            <table className="orders-table w-full bg-white border border-gray-300 rounded shadow-sm">
              <thead>
                <tr>
                  <th className="p-2 border-b">Shop Name</th>
                  <th className="p-2 border-b">Order Date</th>
                  <th className="p-2 border-b">Status</th>
                  <th className="p-2 border-b">Total Quantity</th>
                  <th className="p-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={index}>
                    <td className="p-2 border-b">{order.shopName}</td>
                    <td className="p-2 border-b">{order.orderDate}</td>
                    <td className="p-2 border-b">{order.status}</td>
                    <td className="p-2 border-b">
                      {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </td>
                    <td className="p-2 border-b">
                      <button
                        className="view-button"
                        onClick={() => handleViewDetails(order)}
                      >
                        View Details
                      </button>
                      <button
                        className="edit-button ml-2"
                        onClick={() => handleEdit(order)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button ml-2"
                        onClick={() => handleDelete(order._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for viewing order details */}
      {isModalOpen && selectedOrder && (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white p-6 rounded shadow-md relative">
            <span className="close-button absolute top-2 right-2 text-xl cursor-pointer" onClick={handleCloseModal}>&times;</span>
            <h2 className="modal-title text-lg font-bold mb-4">Order Details</h2>
            <p><strong>Shop Name:</strong> {selectedOrder.shopName}</p>
            <p><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Total Quantity:</strong> {selectedOrder.orderItems.reduce((acc, item) => acc + item.quantity, 0)}</p>
            <h3 className="modal-items-title text-md font-semibold mt-4">Items:</h3>
            <ul className="modal-items-list list-disc ml-6">
              {selectedOrder.orderItems.map((item, index) => (
                <li key={index} className="modal-item">
                  <strong>{item.name}:</strong> {item.quantity} units
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Modal for editing order */}
      {isEditModalOpen && (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white p-6 rounded shadow-md relative">
            <span className="close-button absolute top-2 right-2 text-xl cursor-pointer" onClick={handleCloseEditModal}>&times;</span>
            <h2 className="modal-title text-lg font-bold mb-4">Edit Order</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group mb-4">
                <label htmlFor="shopName" className="block text-sm font-semibold mb-2">Shop Name:</label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={editFormData.shopName}
                  onChange={handleEditChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="orderDate" className="block text-sm font-semibold mb-2">Order Date:</label>
                <input
                  type="date"
                  id="orderDate"
                  name="orderDate"
                  value={editFormData.orderDate}
                  onChange={handleEditChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="status" className="block text-sm font-semibold mb-2">Status:</label>
                <select
                  id="status"
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditChange}
                  className="form-input"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div className="form-group mb-4">
                <label className="block text-sm font-semibold mb-2">Order Items:</label>
                {editFormData.orderItems.map((item, index) => (
                  <div key={index} className="form-group mb-2">
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleEditItemsChange(index, e)}
                      className="form-input"
                      placeholder="Item Name"
                      required
                    />
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleEditItemsChange(index, e)}
                      className="form-input ml-2"
                      placeholder="Quantity"
                      required
                    />
                  </div>
                ))}
              </div>
              <button type="submit" className="submit-button bg-blue-500 text-white p-2 rounded">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrderList;
