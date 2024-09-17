import React, { useState } from 'react';
import './leaveform.css';
import { Link } from "react-router-dom";
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import axios from 'axios';

const LeaveRequestForm = () => {
  const [empId, setEmpId] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/Leave', {
        empId,
        name,
        startDate,
        endDate,
        reason,
        type,
      });

      setMessage(response.data.msg);
    } catch (error) {
      console.error('Error submitting leave request:', error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.error || 'An error occurred while submitting the leave request.');
      } else {
        setMessage('An error occurred while submitting the leave request.');
      }
    }
  };

  const handleViewClick = () => {
    alert('View button clicked!');
    // Add any functionality you need here, such as navigating to a different view
  };

  return (
    <div>
      <Header />
      <div className="form-container">
        <h2 className="form-title">Leave Request Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="empId">Employee ID</label>
            <input
              id="empId"
              type="text"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reason">Reason</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
            </select>
          </div>
          <div className="button-container">
            <button className="submit-button" type="submit">
              Submit
            </button>
            <Link to="Aret">
              <button className="view-button" type="button" onClick={handleViewClick}>
                View
              </button>
            </Link>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
      <Footer />
    </div>
  );
};

export default LeaveRequestForm;
