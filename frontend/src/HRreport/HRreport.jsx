import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './HRreport.css';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';

const HRManagementReport = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    // Fetch or simulate data fetching for salary, leave, and attendance
    setSalaryData([
      { employeeId: 'E001', name: 'John Doe', salary: 5000, allowances: 500, otHours: 10 },
      { employeeId: 'E002', name: 'Jane Smith', salary: 4500, allowances: 400, otHours: 5 },
    ]);

    setLeaveData([
      { employeeId: 'E001', name: 'John Doe', leaveType: 'Sick Leave', daysTaken: 3 },
      { employeeId: 'E002', name: 'Jane Smith', leaveType: 'Vacation', daysTaken: 5 },
    ]);

    setAttendanceData([
      { employeeId: 'E001', name: 'John Doe', daysPresent: 22, daysAbsent: 2 },
      { employeeId: 'E002', name: 'Jane Smith', daysPresent: 20, daysAbsent: 4 },
    ]);
  }, []);

  return (
    <div>
      <Header />
      <div className="hr-report-container">
      <h1 className="hr-report-title">HR Management Report</h1>

      {/* Salary Management Section */}
      <section className="report-section">
        <h2 className="report-subtitle">Salary Management</h2>
        <BarChart width={600} height={300} data={salaryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="salary" fill="#8884d8" />
          <Bar dataKey="allowances" fill="#82ca9d" />
          <Bar dataKey="otHours" fill="#ffc658" />
        </BarChart>
        <table className="report-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Salary</th>
              <th>Allowances</th>
              <th>OT Hours</th>
            </tr>
          </thead>
          <tbody>
            {salaryData.map((data, index) => (
              <tr key={index}>
                <td>{data.employeeId}</td>
                <td>{data.name}</td>
                <td>${data.salary}</td>
                <td>${data.allowances}</td>
                <td>{data.otHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Leave Management Section */}
      <section className="report-section">
        <h2 className="report-subtitle">Leave Management</h2>
        <BarChart width={600} height={300} data={leaveData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="daysTaken" fill="#8884d8" />
        </BarChart>
        <table className="report-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Leave Type</th>
              <th>Days Taken</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.map((data, index) => (
              <tr key={index}>
                <td>{data.employeeId}</td>
                <td>{data.name}</td>
                <td>{data.leaveType}</td>
                <td>{data.daysTaken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Attendance Tracking Section */}
      <section className="report-section">
        <h2 className="report-subtitle">Attendance Tracking</h2>
        <BarChart width={600} height={300} data={attendanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="daysPresent" fill="#8884d8" />
          <Bar dataKey="daysAbsent" fill="#82ca9d" />
        </BarChart>
        <table className="report-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Days Present</th>
              <th>Days Absent</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((data, index) => (
              <tr key={index}>
                <td>{data.employeeId}</td>
                <td>{data.name}</td>
                <td>{data.daysPresent}</td>
                <td>{data.daysAbsent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
    <Footer />
    </div>
  );
};

export default HRManagementReport;
