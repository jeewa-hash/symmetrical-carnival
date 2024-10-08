import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './salarycalculateui.css';

const EmployeeSalaryForm = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const navigate = useNavigate();

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

  const departmentToDesignation = {
    "Production Department": [
      { name: "Production Manager", role: "permanent" },
      { name: "Machine Operator", role: "contract" },
      { name: "Production Worker", role: "contract" },
    ],
    "Supply Chain and Procurement Department": [
      { name: "Supply Chain Manager", role: "permanent" },
      { name: "Warehouse Manager", role: "permanent" },
      { name: "Inventory Controller", role: "contract" },
    ],
    "Sales and Marketing Department": [
      { name: "Sales Manager", role: "permanent" },
      { name: "Marketing Manager", role: "permanent" },
      { name: "Sales Representative", role: "contract" },
    ],
    "Order Management Department": [
      { name: "Order Manager", role: "permanent" },
      { name: "Order Fulfillment Coordinator", role: "contract" },
    ],
    "Human Resources Department": [
      { name: "HR Manager", role: "permanent" },
      { name: "Training and Development Officer", role: "contract" },
    ],
    "Finance Department": [
      { name: "Finance Manager", role: "permanent" },
      { name: "Financial Analyst", role: "contract" },
    ],
    "Logistics and Warehouse Department": [
      { name: "Delivery Manager", role: "permanent" },
      { name: "Delivery Driver", role: "contract" },
      { name: "Inventory Specialist", role: "contract" },
    ],
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

  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "employeeId") {
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

      if (sanitizedValue === "") {
        setFormData((prevData) => ({ ...prevData, [name]: "" }));
      } else {
        const numberValue = parseFloat(sanitizedValue);
        // Ensure that the number is strictly positive (greater than 0)
        if (!isNaN(numberValue) && numberValue >= 0) {
          setFormData((prevData) => ({ ...prevData, [name]: numberValue }));
        }
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const fetchEmployeeDetails = async (id) => {
    try {
      const response = await axios.get(`/api/employees/${id}`);
      if (response.data) {
        const { firstName, lastName, email, nic, department, designation, employeeType, basicSalary } = response.data;
        setFormData((prevData) => ({
          ...prevData,
          employeeName: `${firstName} ${lastName}`,
          email: email,
          nic: nic,
          department: department,
          designation: designation,
          employeeRole: employeeType,
          basicSalary: basicSalary,
        }));
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      alert("Failed to fetch employee details. Please check the Employee ID.");
    }
  };

  const handleEmployeeIdChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, employeeId: value }));

    if (e.key === "Enter" && value) {
      fetchEmployeeDetails(value);
    }
  };

  const getDesignations = () => {
    return formData.department ? departmentToDesignation[formData.department] || [] : [];
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

    const epfEmployee = calculateEarnings().grossSalary * 0.08;
    const etfEmployer = calculateEarnings().grossSalary * 0.03;

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
        <h2>Employee Salary Details</h2>
        <div className="form-group">
          <label htmlFor="employeeId">Employee ID:</label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleEmployeeIdChange}
            onKeyDown={handleEmployeeIdChange}
            placeholder="Enter Employee ID and press Enter"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="employeeName">Employee Name:</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            placeholder="Employee Name"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="nic">NIC:</label>
          <input
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            placeholder="NIC"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          {emailError && <span className="error">{emailError}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="Production Department">Production Department</option>
            <option value="Supply Chain and Procurement Department">Supply Chain and Procurement Department</option>
            <option value="Sales and Marketing Department">Sales and Marketing Department</option>
            <option value="Order Management Department">Order Management Department</option>
            <option value="Human Resources Department">Human Resources Department</option>
            <option value="Finance Department">Finance Department</option>
            <option value="Logistics and Warehouse Department">Logistics and Warehouse Department</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="designation">Designation:</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          >
            <option value="">Select Designation</option>
            {getDesignations().map((designation) => (
              <option key={designation.name} value={designation.name}>
                {designation.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="employeeRole">Employee Role:</label>
          <input
            type="text"
            name="employeeRole"
            value={formData.employeeRole}
            onChange={handleChange}
            placeholder="Employee Role"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="payrollMonth">Payroll Month:</label>
          <input
            type="month"
            name="payrollMonth"
            value={formData.payrollMonth}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="basicSalary">Basic Salary:</label>
          <input
            type="number"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            placeholder="Basic Salary"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="actualHours">Actual Hours Worked:</label>
          <input
            type="number"
            name="actualHours"
            value={formData.actualHours}
            onChange={handleChange}
            placeholder="Actual Hours Worked"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="overtimeHours">Overtime Hours:</label>
          <input
            type="number"
            name="overtimeHours"
            value={formData.overtimeHours}
            onChange={handleChange}
            placeholder="Overtime Hours"
          />
        </div>
        <div className="form-group">
          <label htmlFor="unpaidLeaveDays">Unpaid Leave Days:</label>
          <input
            type="number"
            name="unpaidLeaveDays"
            value={formData.unpaidLeaveDays}
            onChange={handleChange}
            placeholder="Unpaid Leave Days"
          />
        </div>
        <div className="form-group">
          <label htmlFor="noPayLeaveDeduction">No Pay Leave Deduction:</label>
          <input
            type="number"
            name="noPayLeaveDeduction"
            value={formData.noPayLeaveDeduction}
            onChange={handleChange}
            placeholder="No Pay Leave Deduction"
          />
        </div>
        <div className="form-group">
          <label htmlFor="allowances">Allowances:</label>
          <input
            type="number"
            name="allowances"
            value={formData.allowances}
            onChange={handleChange}
            placeholder="Allowances"
          />
        </div>
        <div className="form-group">
          <label htmlFor="bonuses">Bonuses:</label>
          <input
            type="number"
            name="bonuses"
            value={formData.bonuses}
            onChange={handleChange}
            placeholder="Bonuses"
          />
        </div>
        <div className="form-group">
          <label htmlFor="medicalInsurance">Medical Insurance:</label>
          <input
            type="number"
            name="medicalInsurance"
            value={formData.medicalInsurance}
            onChange={handleChange}
            placeholder="Medical Insurance"
          />
        </div>
        <div className="form-group">
          <label htmlFor="epfEmployee">EPF Employee:</label>
          <input
            type="number"
            name="epfEmployee"
            value={formData.epfEmployee}
            onChange={handleChange}
            placeholder="EPF Employee"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="etfEmployer">ETF Employer:</label>
          <input
            type="number"
            name="etfEmployer"
            value={formData.etfEmployer}
            onChange={handleChange}
            placeholder="ETF Employer"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="overtimeAmount">Overtime Amount:</label>
          <input
            type="number"
            name="overtimeAmount"
            value={formData.overtimeAmount}
            onChange={handleChange}
            placeholder="Overtime Amount"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="grossSalary">Gross Salary:</label>
          <input
            type="number"
            name="grossSalary"
            value={formData.grossSalary}
            onChange={handleChange}
            placeholder="Gross Salary"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="netSalary">Net Salary:</label>
          <input
            type="number"
            name="netSalary"
            value={formData.netSalary}
            onChange={handleChange}
            placeholder="Net Salary"
            readOnly
          />
        </div>
        <button type="submit">Submit Salary Details</button>
      </form>
    </div>
  );
};

export default EmployeeSalaryForm;
