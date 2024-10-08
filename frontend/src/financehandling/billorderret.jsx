import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Vieworderinvoice from './vieworderinvoice';
import jsPDF from 'jspdf';
import logo from '../image/logo.png';
import backgr from '../image/BR.png';
import { useNotification } from '../notification/notificatioonContext'; // Import the hook

const RetrieveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);

  const { addNotification } = useNotification(); // Use the notification context

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    setTotalOrderAmount(totalAmount);
  }, [filteredOrders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/billorder');
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage('Error fetching orders. Please try again.');
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterOrders(term, startDate, endDate);
  };

  const handleDateFilter = () => {
    filterOrders(searchTerm, startDate, endDate);
  };

  const filterOrders = (term, start, end) => {
    const filtered = orders.filter(order => {
      const matchesShopName = order.shopName.toLowerCase().includes(term.toLowerCase());
      const matchesDate = (!start || new Date(order.orderDate) >= new Date(start)) &&
        (!end || new Date(order.orderDate) <= new Date(end));
      return matchesShopName && matchesDate;
    });
    setFilteredOrders(filtered);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`/api/billorder/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
      setFilteredOrders(filteredOrders.filter(order => order._id !== orderId));
      setMessage('Order deleted successfully.');
    } catch (error) {
      console.error('Error deleting order:', error);
      setMessage('Error deleting order. Please try again.');
    }
  };

  const downloadPDF = async (order) => {
    const doc = new jsPDF();

    // Load and add logo image in the top-left corner
    const img = await loadImage(logo);
    doc.addImage(img, 'PNG', 10, 10, 50, 30);

    // Invoice Title and Company Details
    doc.setFontSize(20);
    doc.text('INVOICE', 160, 20); // Title at the top-right

    doc.setFontSize(12);
    doc.text('Bear Works Lanka', 10, 50); // Company name
    doc.text('5 Schofield Pl, Colombo 09892', 10, 58); // Address line 1
    doc.text('Phone: +94 123 456 789', 10, 66); // Contact number
    doc.text('Email: bearworkslanka@gmail.com', 10, 74); // Email

    // Invoice Details (Order ID, Date, etc.)
    doc.setFontSize(12);
    doc.text(`Invoice No: ${formatOrderId(order._id)}`, 160, 50);
    doc.text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, 160, 58);
    doc.text(`Due Date: ${new Date().toLocaleDateString()}`, 160, 66); // Example due date

    // Customer Details
    doc.setFontSize(14);
    doc.text('Bill To:', 10, 90);
    doc.setFontSize(12);
    doc.text(order.shopName, 10, 98);
    doc.text(order.shopAddress, 10, 106);

    // Line separator
    doc.line(10, 115, 200, 115);

    // Table Headers for Order Items
    doc.setFontSize(12);
    doc.text('Item', 10, 123);
    doc.text('Quantity', 80, 123);
    doc.text('Unit Price (Rs.)', 120, 123);
    doc.text('Total (Rs.)', 170, 123);

    // Table Rows for each Order Item
    let yPosition = 133;
    order.orderItems.forEach(item => {
      doc.text(item.name, 10, yPosition);
      doc.text(String(item.quantity), 85, yPosition, { align: 'right' });
      doc.text(`Rs.${item.price.toFixed(2)}`, 125, yPosition, { align: 'right' });
      doc.text(`Rs.${item.totalPrice.toFixed(2)}`, 175, yPosition, { align: 'right' });
      yPosition += 10;
    });

    // Line separator
    doc.line(10, yPosition, 200, yPosition);
    yPosition += 10;

    // Total Amount
    doc.setFontSize(12);
    doc.text('Total Amount:', 120, yPosition);
    doc.text(`Rs.${order.totalAmount.toFixed(2)}`, 175, yPosition, { align: 'right' });

    // Footer: Company Address (Bottom Right) and Signature (Bottom Left)
    doc.setFontSize(10);
    doc.text('Bear Works Lanka Pvt. Ltd.', 10, 280);
    doc.text('5 Schofield Pl, Colombo 09892', 10, 288);
    doc.text('Email: bearworkslanka@gmail.com | +94 123 456 789', 10, 296);

    doc.text('Authorized Signature:', 160, 280);
    doc.line(160, 285, 200, 285); // Signature line

    // Save the PDF with formatted Order ID in the filename
    doc.save(`${order.shopName}_Order_${formatOrderId(order._id)}.pdf`);
  };

  // Updated formatOrderId function to generate "BW0001"-style IDs
  const formatOrderId = (id) => {
    const numericId = parseInt(id.slice(-4), 16); // Use the last part of the alphanumeric ID, converted to a number
    return `BW${String(numericId).padStart(4, '0')}`;
  };

  // Utility to load an image for the PDF
  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  };

  const sendNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification('Order Notification', {
        body: message,
        icon: logo,
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Order Notification', {
            body: message,
            icon: logo,
          });
        }
      });
    }
  };

  const handleSendNotification = () => {
    const message = `Total order amount: Rs.${totalOrderAmount.toFixed(2)}`;
    sendNotification(message);
    addNotification(message); // Add the notification to the context
  };

  // Group orders by date
  const groupOrdersByDate = (orders) => {
    const grouped = {};
    orders.forEach(order => {
      const orderDate = new Date(order.orderDate).toLocaleDateString();
      if (!grouped[orderDate]) {
        grouped[orderDate] = [];
      }
      grouped[orderDate].push(order);
    });
    return grouped;
  };

  const renderOrders = () => {
    const groupedOrders = groupOrdersByDate(filteredOrders);
    const sortedDates = Object.keys(groupedOrders).sort((a, b) => new Date(b) - new Date(a)); // Sort dates (past first)

    return sortedDates.map(date => {
      const ordersForDate = groupedOrders[date];
      const totalForDate = ordersForDate.reduce((sum, order) => sum + order.totalAmount, 0);

      return (
        <div key={date} className="order-group">
          <h3>{date} - Total: Rs.{totalForDate.toFixed(2)}</h3>
          {ordersForDate.map(order => (
            <div key={order._id} className="order-card">
              <h4>Shop: {order.shopName}</h4>
              <p>Address: {order.shopAddress}</p>
              <p>Total Amount: Rs.{order.totalAmount.toFixed(2)}</p>
              <button onClick={() => handleView(order)}>View</button>
              <button onClick={() => handleDelete(order._id)}>Delete</button>
              <button onClick={() => downloadPDF(order)}>Download PDF</button>
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="retrieve-orders min-h-screen bg-cover bg-center">
  <div
    className="relative min-h-screen flex flex-col justify-center"
    style={{
      backgroundImage: `url(${backgr})`, // Use backticks for template literals
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6 max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Retrieve Orders</h1>
      {message && <p className="error-message text-red-600 text-center mb-4">{message}</p>}
      
      <div className="flex flex-col space-y-4 mb-6">
        <input
          type="text"
          placeholder="Search by Shop Name"
          value={searchTerm}
          onChange={handleSearch}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 mb-6">
        <button onClick={handleDateFilter} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200">Filter</button>
        <button onClick={handleSendNotification} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-200">Send Total Notification</button>
      </div>
      
      <div className="orders-container space-y-4">
        {renderOrders()}
      </div>
      
      {isDetailsModalOpen && selectedOrder && (
        <Vieworderinvoice order={selectedOrder} onClose={() => setDetailsModalOpen(false)} />
      )}
    </div>
  </div>
</div>

  );
};

export default RetrieveOrders;
