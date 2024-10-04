import React, { useState } from 'react';
import './SalaryMang.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';

const EmployeeSalaryDetailsForm = () => {
  const [employeeSalaryDetails, setEmployeeSalaryDetails] = useState({
    employeeId: '',
    employeeName: '',
    email: '',
    baseSalary: 0,
    allowances: 0,
    otHours: 0,
    department: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEmployeeSalaryDetails((prevEmployeeSalaryDetails) => ({
      ...prevEmployeeSalaryDetails,
      [name]: value,
    }));
  };

  const handleViewClick = () => {
    navigate('/salarymang/salaryret');
  };
  

  return (
    <div>
      <Header />
      <div className="form-container">
      <h2 className="form-title">Employee Salary Details Submit Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employeeId">Employee ID</label>
          <input
            type="text"
            id="employeeId"
            name="employeeId"
            value={employeeSalaryDetails.employeeId}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="employeeName">Employee Name</label>
          <input
            type="text"
            id="employeeName"
            name="employeeName"
            value={employeeSalaryDetails.employeeName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={employeeSalaryDetails.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="baseSalary">Base Salary</label>
          <input
            type="number"
            id="baseSalary"
            name="baseSalary"
            value={employeeSalaryDetails.baseSalary}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="allowances">Allowances</label>
          <input
            type="number"
            id="allowances"
            name="allowances"
            value={employeeSalaryDetails.allowances}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="otHours">OT Hours</label>
          <input
            type="number"
            id="otHours"
            name="otHours"
            value={employeeSalaryDetails.otHours}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={employeeSalaryDetails.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div className="button-container">
          <button type="submit" className="submit-button">
            Submit
          </button>
        
          <button type="button" className="view-button" onClick={handleViewClick}>
            View
          </button>
          
      
        </div>
      </form>
      {isSubmitted && (
        <div className="submitted-details">
          <h3>Submitted Employee Salary Details:</h3>
          <p>Employee ID: {employeeSalaryDetails.employeeId}</p>
          <p>Employee Name: {employeeSalaryDetails.employeeName}</p>
          <p>Email: {employeeSalaryDetails.email}</p>
          <p>Base Salary: {employeeSalaryDetails.baseSalary}</p>
          <p>Allowances: {employeeSalaryDetails.allowances}</p>
          <p>OT Hours: {employeeSalaryDetails.otHours}</p>
          <p>Department: {employeeSalaryDetails.department}</p>
        </div>
      )}
    </div>
    <Footer />
    </div>
  );
};

export default EmployeeSalaryDetailsForm;

