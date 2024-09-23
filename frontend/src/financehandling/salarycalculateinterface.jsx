import React, { useState } from "react";
import './salarycalculateui.css';

const EmployeeSalaryForm = () => {
  const currentMonth = new Date().toISOString().slice(0, 7); // Get current month in YYYY-MM format

  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    department: "",
    designation: "",
    employeeRole: "",
    payrollMonth: currentMonth, // Set default to the current month
    basicSalary: 0,
    actualHours: 0,
    unpaidLeaveDays: 0,
  });

  const [errors, setErrors] = useState({
    employeeName: "",
    employeeId: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate employee name (only letters)
    if (name === "employeeName") {
      const isValidName = /^[A-Za-z\s]+$/.test(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        employeeName: isValidName ? "" : "Name should only contain letters.",
      }));
    }

    // Validate employee ID (2 letters followed by 5 numbers)
    if (name === "employeeId") {
      const isValidId = /^[A-Za-z]{1,2}\d{5}$/.test(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        employeeId: isValidId ? "" : "ID should be 2 letters followed by 5 numbers.",
      }));
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const getDesignations = () => {
    return formData.department ? departmentToDesignation[formData.department] || [] : [];
  };

  const calculateStandardHours = () => {
    return formData.employeeRole === "Permanent" ? 40 : 30;
  };

  const calculateOvertimeHours = () => {
    return Math.max(0, formData.actualHours - calculateStandardHours());
  };

  const calculateAnnualBonus = () => {
    return formData.actualHours > 60 ? 0.25 * formData.basicSalary : 0;
  };

  const calculateIncomeTax = () => {
    return formData.basicSalary > 100000 ? 0.01 * formData.basicSalary : 0;
  };

  const calculateEarnings = () => {
    const overtimeEarnings = calculateOvertimeHours() * (formData.basicSalary / calculateStandardHours() * 1.5);
    const annualBonus = calculateAnnualBonus();
    return (
      parseFloat(formData.basicSalary) +
      parseFloat(overtimeEarnings) +
      parseFloat(annualBonus)
    );
  };

  const calculateDeductions = () => {
    const incomeTax = calculateIncomeTax();
    const epfEmployee = 0.08 * formData.basicSalary;
    const etfEmployer = 0.03 * formData.basicSalary;
    const leaveDeductionAmount = formData.unpaidLeaveDays * (formData.basicSalary / calculateStandardHours());

    return (
      incomeTax +
      epfEmployee +
      leaveDeductionAmount +
      etfEmployer
    );
  };

  const grossSalary = calculateEarnings();
  const totalDeductions = calculateDeductions();
  const netSalary = grossSalary - totalDeductions;

  return (
    <div className="salary-form-container">
      <form className="salary-form">
        <h2>Employee Salary Calculation Form</h2>

        {/* Employee Details */}
        <div className="form-section">
          <h3>Employee Details</h3>
          <label>
            Employee Name:
            <input
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
            />
            {errors.employeeName && <span className="error">{errors.employeeName}</span>}
          </label>
          <label>
            Employee ID:
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
            />
            {errors.employeeId && <span className="error">{errors.employeeId}</span>}
          </label>
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
          {/* Designation and Role Selection */}
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
          <label>
            Payroll Month:
            <input
              type="month"
              name="payrollMonth"
              value={formData.payrollMonth}
              onChange={handleChange}
              min={currentMonth} // Restrict to current month only
              max={currentMonth}
            />
          </label>
        </div>

        {/* Earnings Details */}
        <div className="form-section">
          <h3>Earnings</h3>
          <label>
            Basic Salary:
            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
              min="0"
            />
          </label>
          <label>
            Actual Hours:
            <input
              type="number"
              name="actualHours"
              value={formData.actualHours}
              onChange={handleChange}
              min="0"
            />
          </label>
        </div>

        {/* Attendance Details */}
        <div className="form-section">
          <h3>Attendance Details</h3>
          <label>
            Unpaid Leave Days:
            <input
              type="number"
              name="unpaidLeaveDays"
              value={formData.unpaidLeaveDays}
              onChange={handleChange}
              min="0"
            />
          </label>
        </div>
      </form>

      {/* Salary Details Display */}
      <div className="salary-details-container">
        <div className="earnings-container">
          <h3>Earnings</h3>
          <p>Gross Salary: {grossSalary.toFixed(2)}</p>
          <p>Overtime Hours: {calculateOvertimeHours()}</p>
          <p>Annual Bonus: {calculateAnnualBonus().toFixed(2)}</p>
        </div>

        <div className="deductions-container">
          <h3>Deductions</h3>
          <p>Income Tax: {calculateIncomeTax().toFixed(2)}</p>
          <p>EPF (Employee): {(0.08 * formData.basicSalary).toFixed(2)}</p>
          <p>ETF (Employer): {(0.03 * formData.basicSalary).toFixed(2)}</p>
          <p>Unpaid Leave Deduction: {(formData.unpaidLeaveDays * (formData.basicSalary / calculateStandardHours())).toFixed(2)}</p>
        </div>

        <div className="net-salary-container">
          <h3>Net Salary</h3>
          <p>Net Salary: {netSalary.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalaryForm;
