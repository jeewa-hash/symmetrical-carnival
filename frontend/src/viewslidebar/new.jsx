import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './salarycalculateui.css';

const EmployeeSalaryForm = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    nic: "",
    email: "",
    department: "",
    designation: "",
    employeeRole: "",
    payrollMonth: currentMonth,
    basicSalary: "",
    actualHours: "",
    overtimeHours: 0,
    unpaidLeaveDays: 0,
    noPayLeaveDeduction: 0,
    allowances: 0,
    bonuses: 0,
    medicalInsurance: 0,
    epfEmployee: 0,
    etfEmployer: 0,
    overtimeAmount: 0,
    grossSalary: 0,
    netSalary: 0,
  });

  const [emailError, setEmailError] = useState("");

  // Fetch employee details based on employee ID
  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(`/api/employee/byEmployeeId/${formData.employeeId}`);
      const employeeData = response.data;

      setFormData((prevData) => ({
        ...prevData,
        employeeName: `${employeeData.firstName} ${employeeData.lastName}`,
        nic: employeeData.nic,
        email: employeeData.email,
        department: employeeData.department,
        designation: employeeData.designation,
        employeeRole: employeeData.employeeType,
        basicSalary: employeeData.baseSalary || 0, // Default to 0 if undefined
      }));
    } catch (error) {
      console.error("Error fetching employee details:", error);
      alert("Employee not found. Please check the employee ID.");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "employeeName") {
      if (/^[A-Za-z\s]*$/.test(value) || value === "") {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    } else if (name === "employeeId") {
      if (/^\d{0,5}$/.test(value)) {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    } else if (name === "nic") {
      if (/^\d{0,12}$/.test(value) || /^\d{9}[Vv]?$/.test(value)) {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    } else if (name === "email") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailPattern.test(value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    } else if (
      ["basicSalary", "actualHours", "overtimeHours", "unpaidLeaveDays", "noPayLeaveDeduction", 
       "allowances", "bonuses", "medicalInsurance", "epfEmployee", "etfEmployer", 
       "overtimeAmount", "grossSalary", "netSalary"].includes(name)
    ) {
      // Restrict invalid characters like ++ and -- and allow only digits and a single decimal point
      const sanitizedValue = value
        .replace(/[^0-9.]/g, "") // Remove any non-numeric characters except decimal point
        .replace(/(\..*?)\..*/g, "$1") // Allow only one decimal point
        .replace(/[+-]{2,}/g, ""); // Restrict sequences like ++ or -- 

      const numberValue = sanitizedValue === "" ? "" : parseFloat(sanitizedValue);

      // Ensure that the number is strictly positive (greater than or equal to 0)
      if (numberValue !== "" && numberValue >= 0) {
        setFormData((prevData) => ({ ...prevData, [name]: numberValue }));
      } else {
        setFormData((prevData) => ({ ...prevData, [name]: "" }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle key down event to fetch employee details
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      fetchEmployeeDetails();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) {
      alert("Please fix the email error before submitting.");
      return;
    }
    try {
      const response = await axios.post('/api/salarycalculates', formData);
      console.log("Salary calculated and saved:", response.data);
      alert("Salary calculated and saved successfully!");
    } catch (error) {
      console.error("There was an error submitting the form:", error);
      alert("Failed to save the salary details. Please try again.");
    }
  };

  const calculateEarnings = () => {
    const standardHours = formData.employeeRole === "Permanent" ? 40 : 35;
    const overtimeHours = Math.max(0, formData.actualHours - standardHours);
    const hourlyRate = parseFloat(formData.basicSalary) / (standardHours * 4 || 1);
    const overtimeAmount = overtimeHours * (hourlyRate * 1.5 || 0);
    const grossSalary =
      parseFloat(formData.basicSalary || 0) +
      parseFloat(formData.allowances || 0) +
      parseFloat(formData.bonuses || 0) +
      overtimeAmount;

    return { grossSalary, overtimeAmount, overtimeHours };
  };
  
  const calculateDeductions = () => {
    const noPayLeaveDeduction = parseFloat(formData.unpaidLeaveDays || 0) * (parseFloat(formData.basicSalary || 0) / 30);
    const totalDeductions =
      parseFloat(formData.medicalInsurance || 0) +
      noPayLeaveDeduction;

    const grossSalary = calculateEarnings().grossSalary; // Ensure grossSalary is calculated first
    const epfEmployee = grossSalary * 0.08;
    const etfEmployer = grossSalary * 0.03;

    return { totalDeductions, epfEmployee, etfEmployer, noPayLeaveDeduction };
  };
  
  useEffect(() => {
    const { grossSalary, overtimeAmount, overtimeHours } = calculateEarnings();
    const { totalDeductions, epfEmployee, etfEmployer, noPayLeaveDeduction } = calculateDeductions();
    const netSalary = grossSalary - totalDeductions;

    setFormData((prevData) => ({
      ...prevData,
      grossSalary: grossSalary,
      netSalary: netSalary,
      epfEmployee: epfEmployee,
      etfEmployer: etfEmployer,
      overtimeAmount: overtimeAmount,
      noPayLeaveDeduction: noPayLeaveDeduction,
      overtimeHours: overtimeHours,
    }));
  }, [
    formData.basicSalary,
    formData.actualHours,
    formData.unpaidLeaveDays,
    formData.allowances,
    formData.bonuses,
    formData.medicalInsurance,
    formData.employeeRole,
  ]);
  
  return (
    <div className="employee-salary-form-container">
      <form className="employee-salary-form" onSubmit={handleSubmit}>
        <h2>Employee Salary Calculation Form</h2>

        {/* Employee Details */}
        <div className="employee-details-section">
          <label>Employee ID:</label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          />

          <label>
            Employee Name:
            <input
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
            />
          </label>
        </div>
        
        <div className="input-group">
          <label>
            NIC:
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {emailError && <p className="error">{emailError}</p>}
          </label>
        </div>

        <div className="input-group">
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            readOnly
          />

          <label>Designation:</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            readOnly
          />
        </div>

        <div className="input-group">
          <label>Payroll Month:</label>
          <input
            type="month"
            name="payrollMonth"
            value={formData.payrollMonth}
            onChange={handleChange}
          />
        </div>

        {/* Salary Details */}
        <div className="salary-details-section">
          <label>
            Basic Salary:
            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Actual Hours Worked:
            <input
              type="number"
              name="actualHours"
              value={formData.actualHours}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        {/* Overtime and Deductions */}
        <div className="input-group">
          <label>
            Overtime Hours:
            <input
              type="number"
              name="overtimeHours"
              value={formData.overtimeHours}
              onChange={handleChange}
            />
          </label>

          <label>
            Unpaid Leave Days:
            <input
              type="number"
              name="unpaidLeaveDays"
              value={formData.unpaidLeaveDays}
              onChange={handleChange}
            />
          </label>

          <label>
            No Pay Leave Deduction:
            <input
              type="number"
              name="noPayLeaveDeduction"
              value={formData.noPayLeaveDeduction}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* Allowances and Bonuses */}
        <div className="input-group">
          <label>
            Allowances:
            <input
              type="number"
              name="allowances"
              value={formData.allowances}
              onChange={handleChange}
            />
          </label>

          <label>
            Bonuses:
            <input
              type="number"
              name="bonuses"
              value={formData.bonuses}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* Insurance and Deductions */}
        <div className="input-group">
          <label>
            Medical Insurance:
            <input
              type="number"
              name="medicalInsurance"
              value={formData.medicalInsurance}
              onChange={handleChange}
            />
          </label>

          <label>
            EPF Employee Contribution:
            <input
              type="number"
              name="epfEmployee"
              value={formData.epfEmployee}
              onChange={handleChange}
              readOnly
            />
          </label>

          <label>
            ETF Employer Contribution:
            <input
              type="number"
              name="etfEmployer"
              value={formData.etfEmployer}
              onChange={handleChange}
              readOnly
            />
          </label>
        </div>

        {/* Salary Summary */}
        <div className="salary-summary">
          <h3>Salary Summary</h3>
          <p>Gross Salary: {formData.grossSalary}</p>
          <p>Net Salary: {formData.netSalary}</p>
          <p>Overtime Amount: {formData.overtimeAmount}</p>
        </div>

        <button type="submit">Calculate Salary</button>
      </form>
    </div>
  );
};

export default EmployeeSalaryForm;
