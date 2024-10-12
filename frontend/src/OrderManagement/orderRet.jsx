import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf'; // Importing jsPDF library
import 'jspdf-autotable'; // Importing autotable plugin for jsPDF

import backgr from '../image/bbk.png';
import logo from '../image/logo.png'; // Update the path as necessary

const availableItems = [
{ id: 1, name: ' Bear' },
{ id: 2, name: 'Teddy Bear With Heart' },
{ id: 3, name: '5 Feet' },
{ id: 4, name: 'Dalmation' },
{ id: 5, name: 'Dog' },
{ id: 6, name: 'Bear With Heart' },
{ id: 6, name: 'Bunny Rabbit' },
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

const handleAddNewItem = () => {  //validation error
  const item = availableItems.find((item) => item.name === selectedNewItem);

  // Check if newQuantity contains only positive digits (no negative numbers, strings, or special characters)
  const isValidQuantity = /^[1-9]\d*$/.test(newQuantity); // Ensures it starts with 1-9 and is a positive integer

  if (!isValidQuantity || newQuantity === '') {
    alert('Quantity must be a valid positive number (no decimals or special characters).');
    return;
  }

  if (item) {
    setEditFormData((prevData) => ({
      ...prevData,
      orderItems: [
        ...prevData.orderItems,
        { name: item.name, quantity: parseInt(newQuantity, 10) }, // Convert to number
      ],
    }));
    setSelectedNewItem(''); // Clear the selected item
    setNewQuantity('1'); // Reset quantity to a valid default value (positive digit)
    setShowNewItemInput(false); // Hide the input field for adding new items
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
// Function to download PDF
const downloadPDF = () => {
  const doc = new jsPDF();
  doc.setFont('Helvetica', 'normal');

  // Add logo
  doc.addImage(logo, 'PNG', 14, 10, 50, 20); // Adjust position and size as necessary
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102); // Adjust color to match the soft toy theme
  doc.text('Bear Works Lanka', 70, 20); // Adjust position as necessary
  
  // Draw Header Line
  doc.setDrawColor(0, 0, 0); // Set line color to black
  doc.line(14, 32, doc.internal.pageSize.width - 14, 32); // Draw line below the header

  // Add title
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0); // Set text color back to black
  doc.text('Soft Toy Order List', 20, 55);

  // Add date
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 65);

  // Add table header
  const headers = ['Shop Name', 'Order Date', 'Status', 'Items'];
  const data = filteredOrders.map(order => [
    order.shopName,
    formatDate(order.orderDate),
    order.status,
    // Map items to an array, with each item in a new line
    order.orderItems.map(item => `${item.name} (Qty: ${item.quantity})`), // No join here, let autoTable handle the array
  ]);

  // Create table
  doc.autoTable({
    head: [headers],
    body: data,
    startY: 70, // Adjust starting position of the table
    styles: {
      overflow: 'linebreak', // Enable line break to allow items to display on new lines
    },
    columnStyles: {
      3: { cellWidth: 'wrap' }, // Ensure "Items" column wraps the text within the cell
    },
  });

  // Draw Footer Line
  const footerY = doc.internal.pageSize.height - 30; // Position for footer line
  doc.line(14, footerY, doc.internal.pageSize.width - 14, footerY); // Draw line above the footer

  // Add Footer
  doc.setFontSize(12); // Set font size for footer
  doc.setFont("helvetica", "normal"); // Set font to normal
  doc.setTextColor(0, 0, 0); // Set color to black
  const footerText = "Address: 123 Bear Lane, Colombo, Sri Lanka\nContact: +94 123 456 789"; // Sample footer text
  const footerLines = doc.splitTextToSize(footerText, doc.internal.pageSize.width - 28); // Split text to fit the page

  doc.text(footerLines, 14, footerY + 10); // Draw footer text below the footer line

  // Save the PDF
  doc.save('soft_toy_order_list.pdf');
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

 {/* PDF Download Button */}
 <button
            onClick={downloadPDF}
            className="mb-4 bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition duration-200"
          >
            Download PDF
          </button>

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
              {showNewItemInput ? (  // Show new item validation
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
      onChange={(e) => {
        const value = e.target.value;

        // Ensure the value contains only digits and is a positive integer
        if (/^\d*$/.test(value)) {
          setNewQuantity(value);
        }
      }}
      className="ml-2 w-1/4 p-2 border border-gray-300 rounded"
      placeholder="Quantity"
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