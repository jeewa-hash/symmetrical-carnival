import React, { useState, useEffect } from 'react';

const Dashboard = ({ transactions, setFilter }) => {
  const [dashboardData, setDashboardData] = useState({
    totalAmount: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    calculateDashboardData();
  }, [transactions]);

  const calculateDashboardData = () => {
    const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const transactionCount = transactions.length;
    setDashboardData({ totalAmount, transactionCount });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="dashboard bg-white shadow p-6 rounded-md mb-8">
      <h2 className="text-2xl font-semibold mb-4">Transaction Dashboard</h2>

      {/* Filter Options */}
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 font-medium">Filter by:</label>
        <select id="filter" onChange={handleFilterChange} className="border p-2 rounded">
          <option value="all">All</option>
          <option value="day">Today</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Display Dashboard Data */}
      <div className="flex justify-between">
        <div className="dashboard-item">
          <h3 className="text-lg font-medium">Total Amount</h3>
          <p className="text-2xl font-bold">${dashboardData.totalAmount.toFixed(2)}</p>
        </div>
        <div className="dashboard-item">
          <h3 className="text-lg font-medium">Transaction Count</h3>
          <p className="text-2xl font-bold">{dashboardData.transactionCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
