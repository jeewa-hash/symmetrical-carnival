import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf'; 
import './orderlist.css';
import ViewOrder from '../vieworder/ViewOrder'; 
import 'jspdf-autotable';


const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null); 

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const filteredOrders = orders
    .filter(order => (filter ? order.status === filter : true))
    .filter(order =>
      search ? order.supplierName.toLowerCase().includes(search.toLowerCase()) : true
    );

 
  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
  };

 
  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Order List Summary', 14, 22); 

    
    const tableColumnHeaders = ["Supplier", "Order Date", "Status"];

    
    const tableRows = filteredOrders.map(order => [
      order.supplierName,
      new Date(order.orderDate).toLocaleDateString(),
      order.status,
    ]);

  
    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 30, 
    });

  
    doc.save('order-list-summary.pdf');
  };

  return (
    <div className="order-list-container">
      {/* Conditionally Render the ViewOrder Component if selectedOrderId is set */}
      {selectedOrderId ? (
        <ViewOrder orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
      ) : (
        <>
          {/* Filters Section */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search by supplier"
              className="search-input"
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="filter-select"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="completed">completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
            </select>

            {/* Report Generation Button */}
            <button className="report-button" onClick={generateReport}>
              Generate Report
            </button>
          </div>

          {/* Orders Table */}
          <table className="order-table">
            <thead>
              <tr>
                <th className="table-header">Supplier</th>
                <th className="table-header">Order Date</th>
                <th className="table-header">Status</th>
                <th className="table-header">View Order</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td className="table-cell">{order.supplierName}</td>
                  <td className="table-cell">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="table-cell">{order.status}</td>
                  <td className="table-cell">
                    <button
                      className="view-order-button"
                      onClick={() => handleViewOrder(order._id)} 
                    >
                      View Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default OrderList;
