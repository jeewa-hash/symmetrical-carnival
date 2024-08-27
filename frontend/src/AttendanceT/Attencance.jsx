import React, { useState } from 'react';
import './Attendance.css';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';

const AttendanceTrackingForm = () => {
  const [empId, setEmpId] = useState('');
  const [date, setDate] = useState('');
  const [clockIn, setClockIn] = useState('');
  const [clockOut, setClockOut] = useState('');
  const [present, setPresent] = useState(false);
  const [attendees, setAttendees] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAttendees([...attendees, { empId, date, clockIn, clockOut, present }]);
    // Clear the form fields after submission
    setEmpId('');
    setDate('');
    setClockIn('');
    setClockOut('');
    setPresent(false);
  };

  const handleViewClick = () => {
    alert('View button clicked!');
    // Add any functionality you need here, such as navigating to a different view
  };

  return (
    <div>
      <Header />
      <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Attendance Tracking Form</h2>
        <button className="view-button" onClick={handleViewClick}>
          View
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="empId">Employee ID:</label>
          <input
            id="empId"
            type="text"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            placeholder="Employee ID"
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="clockIn">Clock In Time:</label>
          <input
            id="clockIn"
            type="time"
            value={clockIn}
            onChange={(e) => setClockIn(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="clockOut">Clock Out Time:</label>
          <input
            id="clockOut"
            type="time"
            value={clockOut}
            onChange={(e) => setClockOut(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="present">Present:</label>
          <input
            id="present"
            type="checkbox"
            checked={present}
            onChange={(e) => setPresent(e.target.checked)}
          />
        </div>
        <button className="submit-button" type="submit">
          Add Attendee
        </button>
      </form>
      <h2 className="attendees-title">Attendees:</h2>
      <ul className="attendees-list">
        {attendees.map((attendee, index) => (
          <li key={index} className="attendee-item">
            <span>{attendee.empId}</span>
            <span>{attendee.date}</span>
            <span>{attendee.clockIn}</span>
            <span>{attendee.clockOut}</span>
            <span>{attendee.present ? 'Present' : 'Absent'}</span>
          </li>
        ))}
      </ul>
    </div>
    <Footer />
    </div>
  );
};

export default AttendanceTrackingForm;

