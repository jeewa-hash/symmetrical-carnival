import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Vieworderinvoice from './vieworderinvoice'; 
import './billoderret.css';
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
    const img = await loadImage(logo);
    doc.addImage(img, 'PNG', 10, 10, 40, 40);
    
    doc.setFontSize(12);
    doc.text('Bear Works Lanka', 60, 20);
    doc.text('5 Schofield Pl, Colombo 09892', 60, 30);
    doc.text('bearworkslanka@gmail.com', 60, 40);
    
    doc.setFontSize(16);
    doc.text(`Invoice #${order._id}`, 10, 60);
    doc.setFontSize(12);
    doc.text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, 10, 70);
    doc.text(`Shop Name: ${order.shopName}`, 10, 80);
    doc.text(`Shop Address: ${order.shopAddress}`, 10, 90);
    doc.text(`Total Amount: Rs.${order.totalAmount.toFixed(2)}`, 10, 100);
    
    doc.line(10, 110, 200, 110);
    
    let y = 120;
    order.orderItems.forEach(item => {
      doc.text(`Item: ${item.name}`, 10, y);
      doc.text(`Quantity: ${item.quantity}`, 80, y);
      doc.text(`Price: Rs.${item.price.toFixed(2)}`, 140, y);
      doc.text(`Total: Rs.${item.totalPrice.toFixed(2)}`, 180, y);
      y += 10;
    });
    
    doc.save(`${order.shopName}_Order_${order._id}.pdf`);
  };

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
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const message = `Total order amount: Rs.${totalAmount.toFixed(2)}`;
    sendNotification(message);
    addNotification(message); // Add the notification to the context
  };

  // Grouping orders by date
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const date = new Date(order.orderDate).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(order);
    return acc;
  }, {});

  return (
    <div className="bg-purple-500 min-h-screen">
      <div
        className="relative min-h-screen flex flex-col justify-center"
        style={{
          backgroundImage: `url(${backgr})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
          {isDetailsModalOpen && (
            <Vieworderinvoice
              order={selectedOrder}
              onClose={() => setDetailsModalOpen(false)}
            />
          )}
        
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">All Orders</h2>
          {message && <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4">{message}</div>}
          
          <div className="flex space-x-4 mb-6">
            <input
              type="text"
              placeholder="Search by shop name..."
              value={searchTerm}
              onChange={handleSearch}
              className="p-2 border border-gray-300 rounded-md shadow-sm w-1/2"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md shadow-sm w-1/4"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md shadow-sm w-1/4"
            />
            <button onClick={handleDateFilter} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
              Filter by Date
            </button>
          </div>

          {/* Rendering grouped orders */}
          {Object.keys(groupedOrders).map(date => (
            <div key={date} className="mb-6">
              <h3 className="text-lg font-bold text-gray-700 mb-2">Date: {date}</h3>
              <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <tr>
                    <th className="py-3 px-6 text-left">Shop Name</th>
                    <th className="py-3 px-6 text-left">Shop Address</th>
                    <th className="py-3 px-6 text-left">Order Date</th>
                    <th className="py-3 px-6 text-right">Total Amount</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  {groupedOrders[date].map(order => (
                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left">{order.shopName}</td>
                      <td className="py-3 px-6 text-left">{order.shopAddress}</td>
                      <td className="py-3 px-6 text-left">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="py-3 px-6 text-right">Rs.{order.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-6 text-center">
                        <button onClick={() => handleView(order)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 rounded-md">
                          View
                        </button>
                        <button onClick={() => handleDelete(order._id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-md ml-2">
                          Delete
                        </button>
                        <button onClick={() => downloadPDF(order)} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 rounded-md ml-2">
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="py-3 px-6 text-right font-bold">Total:</td>
                    <td className="py-3 px-6 text-right">
                      Rs.{groupedOrders[date].reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-6"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RetrieveOrders;
