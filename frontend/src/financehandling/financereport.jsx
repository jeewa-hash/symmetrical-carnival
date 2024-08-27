import React, { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, Line, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import './fireport.css'; // Import the CSS file
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";

// Sample data
const orderBillData = [
  { name: 'Jan', bills: 1000, orders: 1200 },
  { name: 'Feb', bills: 1500, orders: 1600 },
  { name: 'Mar', bills: 1200, orders: 1300 },
  { name: 'Apr', bills: 1700, orders: 1800 },
  { name: 'May', bills: 1600, orders: 1900 },
  { name: 'Jun', bills: 2000, orders: 2200 },
];

const salaryData = [
  { name: 'Jan', salary: 5000 },
  { name: 'Feb', salary: 5200 },
  { name: 'Mar', salary: 5300 },
  { name: 'Apr', salary: 5500 },
  { name: 'May', salary: 5600 },
  { name: 'Jun', salary: 5800 },
];

const profitData = [
  { name: 'Profit', value: 40000 },
  { name: 'Expenses', value: 25000 },
  { name: 'Other', value: 15000 },
];

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const FinanceManagementReport = () => {
  const [orders, setOrders] = useState(orderBillData);
  const [salaries, setSalaries] = useState(salaryData);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders =>
        prevOrders.map(order => ({
          ...order,
          bills: Math.floor(Math.random() * 3000) + 500,
        }))
      );
      setSalaries(prevSalaries =>
        prevSalaries.map(salary => ({
          ...salary,
          salary: Math.floor(Math.random() * 6000) + 5000,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
        <Header/>
    <div className="report-container">
      <h1 className="report-title">Finance Management Report</h1>
      <div className="charts-container">
        <div className="chart-wrapper">
          <LineChart width={400} height={250} data={orders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bills" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
          </LineChart>
          <h2 className="chart-title">Order Bill Report</h2>
        </div>
        <div className="chart-wrapper">
          <LineChart width={400} height={250} data={salaries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="salary" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
          <h2 className="chart-title">Salary Report</h2>
        </div>
        <div className="chart-wrapper">
          <PieChart width={400} height={250}>
            <Pie
              data={profitData}
              dataKey="value"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {profitData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <h2 className="chart-title">Company Profit</h2>
        </div>
      </div>
      <div className="tables-container">
        <div className="report-table">
          <h3 className="table-title">Salary Details</h3>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((salary, index) => (
                <tr key={index}>
                  <td>{salary.name}</td>
                  <td>{salary.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="report-table">
          <h3 className="table-title">Order Bill Details</h3>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Bills</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.name}</td>
                  <td>{order.bills}</td>
                  <td>{order.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default FinanceManagementReport;
