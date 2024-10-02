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
    } else  if (name === "email") {
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
        if (!isNaN(numberValue) && numberValue > 0) {
          setFormData((prevData) => ({ ...prevData, [name]: numberValue }));
        }
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
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
        <h2>Employee Salary Calculation Form</h2>

        {/* Employee Details */}
        <div className="employee-details-section">
          <h3>Employee Details</h3>
          <div className="input-group">
            <label>
              Employee Name:
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
              />
            </label>
            <label>
              Employee ID:
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                maxLength={5}
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
      maxLength={12}  // Restricts input length to 9 digits + 1 character (V/v)
    />
  </label>
</div>

<div className="input-group">
  <label>
    Email:
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      title="Enter a valid email address"
      required
    />
  </label>
  {emailError && <span className="error-message">{emailError}</span>} {/* Error message displayed here */}
</div>


          <div className="input-group">
            <label>
              Department:
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {Object.keys(departmentToDesignation).map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>
            {formData.department && (
              <label>
                Designation:
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                >
                  <option value="">Select Designation</option>
                  {getDesignations().map((designation) => (
                    <option key={designation.name} value={designation.name}>
                      {designation.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {formData.designation && (
              <label>
                Employee Role:
                <select
                  name="employeeRole"
                  value={formData.employeeRole}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                </select>
              </label>
            )}
          </div>
          <label>
            Payroll Month:
            <input
              type="month"
              name="payrollMonth"
              value={formData.payrollMonth}
              onChange={handleChange}
              min={currentMonth}
              max={currentMonth}
            />
          </label>
        </div>

        {/* Earnings Details */}
        <div className="earnings-section">
          <h3>Earnings</h3>
          <div className="input-group">
            <label>
              Basic Salary:
              <input
                type="number"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
                step="0.01" // Allow decimal values
                min="0"     // Prevent negative values
              />
            </label>
            <label>
              Actual Hours Worked:
              <input
                type="number"
                name="actualHours"
                value={formData.actualHours}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="input-group">
            <label>
              Overtime Hours:
              <input
                type="number"
                name="overtimeHours"
                value={formData.overtimeHours}
                onChange={handleChange}
                readOnly
              />
            </label>
            <label>
              Overtime Amount:
              <input
                type="number"
                name="overtimeAmount"
                value={formData.overtimeAmount}
                onChange={handleChange}
                readOnly
              />
            </label>
          </div>
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
        </div>

        {/* Deductions Details */}
        <div className="deductions-section">
          <h3>Deductions</h3>
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
                readOnly
              />
            </label>
          </div>
        </div>

        {/* Salary Summary */}
        <div className="salary-summary-section">
          <h3>Salary Summary</h3>
          <div className="input-group">
            <label>
              Gross Salary:
              <input
                type="number"
                name="grossSalary"
                value={formData.grossSalary}
                onChange={handleChange}
                readOnly
              />
            </label>
            <label>
              Net Salary:
              <input
                type="number"
                name="netSalary"
                value={formData.netSalary}
                onChange={handleChange}
                readOnly
              />
            </label>
          </div>
        </div>

        <button type="submit">Submit</button>
        <button onClick={() => navigate('/salaryret')}>View All Salary Records</button>
      </form>
    </div>
  );
};

export default EmployeeSalaryForm;
