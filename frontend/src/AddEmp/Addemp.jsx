import React, { useState } from 'react';
import './addemp.css';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import axios from 'axios';

const departments = ['Sales', 'Marketing', 'IT', 'HR', 'Finance'];
const employeeTypes = ['Permanent', 'Contract'];

const AddEmployeeForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState(departments[0]);
  const [employeeId, setEmployeeId] = useState('');
  const [employeeType, setEmployeeType] = useState(employeeTypes[0]);
  const [baseSalary, setBaseSalary] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/employee', {
        firstName,
        lastName,
        email,
        department,
        employeeId,
        employeeType,
        baseSalary
      });
      setMessage('Employee added successfully!');
      // Clear the form fields after successful submission
      setFirstName('');
      setLastName('');
      setEmail('');
      setDepartment(departments[0]);
      setEmployeeId('');
      setEmployeeType(employeeTypes[0]);
      setBaseSalary('');
    } catch (error) {
      console.error('Error adding employee:', error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || 'An error occurred while adding the employee.');
      } else {
        setMessage('An error occurred while adding the employee.');
      }
    }
  };

  const handleViewClick = () => {
    alert('View button clicked!');
    // Add any additional functionality if needed
  };

  return (
    <div>
      <Header />
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">Add Employee Form</h2>
          <button className="view-button" onClick={handleViewClick}>
            View
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID:</label>
            <input
              id="employeeId"
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Employee ID"
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department:</label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="employeeType">Employee Type:</label>
            <select
              id="employeeType"
              value={employeeType}
              onChange={(e) => setEmployeeType(e.target.value)}
            >
              {employeeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="baseSalary">Base Salary:</label>
            <input
              id="baseSalary"
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              placeholder="Base Salary"
            />
          </div>
          <button className="submit-button" type="submit">
            Add Employee
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
      <Footer />
    </div>
  );
};

export default AddEmployeeForm;
