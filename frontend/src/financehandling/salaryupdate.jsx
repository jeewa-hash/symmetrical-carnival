import React, { useState, useEffect } from "react";
import axios from "axios";

const SalaryUpdate = ({ salary, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    employeeName: salary.employeeName,
    employeeId: salary.employeeId,
    nic: salary.nic,
    email: salary.email,
    department: salary.department,
    payrollMonth: salary.payrollMonth,
    basicSalary: salary.basicSalary,
    actualHours: salary.actualHours,
    overtimeHours: 0,
    unpaidLeaveDays: salary.unpaidLeaveDays,
    noPayLeaveDeduction: 0,
    allowances: salary.allowances,
    bonuses: salary.bonuses,
    medicalInsurance: salary.medicalInsurance,
    epfEmployee: 0,
    etfEmployer: 0,
    overtimeAmount: 0,
    grossSalary: 0,
    netSalary: 0,
  });

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      grossSalary: grossSalary.toFixed(2),
      netSalary: netSalary.toFixed(2),
      overtimeAmount: overtimeAmount.toFixed(2),
      overtimeHours,
      epfEmployee: epfEmployee.toFixed(2),
      etfEmployer: etfEmployer.toFixed(2),
      noPayLeaveDeduction: noPayLeaveDeduction.toFixed(2),
    }));
  }, [formData.basicSalary, formData.allowances, formData.bonuses, formData.actualHours, formData.unpaidLeaveDays, formData.medicalInsurance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting salary update:", formData);
    try {
      const response = await axios.put(`/api/salarycalculates/${salary._id}`, formData);
      console.log("Response from server:", response.data);
      if (response.status === 200) {
        setFormData(response.data); // Update state with the response data
        onUpdate(response.data); // Pass the updated data to the parent component
        setMessage('Employee salary record updated successfully.'); // Success message
        setError(null); // Clear any previous error messages
        onClose(); // Close the modal after a short delay
        setTimeout(onClose, 2000); // Automatically close modal after 2 seconds
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      setMessage(null); // Clear any previous success messages
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center items-start bg-gray-600 bg-opacity-50">
  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-[50%] h-auto overflow-y-auto">
    <span className="cursor-pointer text-gray-600 float-right" onClick={onClose}>
      &times;
    </span>
    <h2 className="text-lg font-semibold mb-4 text-center">Edit Salary for {formData.employeeName}</h2>
    {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
    {message && <div className="text-green-600 mb-2 text-sm">{message}</div>}
    
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display fields that should not be editable */}
      <div className="grid grid-cols-2 gap-4">
      {[ 
        { label: "Employee Name", name: "employeeName" },
        { label: "Employee ID", name: "employeeId" },
        { label: "NIC", name: "nic" },
        { label: "Email", name: "email" },
        { label: "Department", name: "department" },
        { label: "Payroll Month", name: "payrollMonth" }
      ].map(({ label, name }) => (
        <div key={name}>
          <label className="block text-gray-700 text-sm">{label}</label>
          <input
            type="text"
            name={name}
            value={formData[name]}
            readOnly
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 bg-gray-100 text-sm"
          />
        </div>
      ))}
      </div>

      {/* Editable fields arranged in pairs */}
      <div className="grid grid-cols-3 gap-4"> 
        <div>
          <label className="block text-gray-700 text-sm">Basic Salary</label>
          <input
            type="number"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm">Actual Hours</label>
          <input
            type="number"
            name="actualHours"
            value={formData.actualHours}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm">Unpaid Leave Days</label>
          <input
            type="number"
            name="unpaidLeaveDays"
            value={formData.unpaidLeaveDays}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm">Allowances</label>
          <input
            type="number"
            name="allowances"
            value={formData.allowances}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm">Bonuses</label>
          <input
            type="number"
            name="bonuses"
            value={formData.bonuses}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm">Medical Insurance</label>
          <input
            type="number"
            name="medicalInsurance"
            value={formData.medicalInsurance}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md border-gray-300 text-sm"
            required
          />
        </div>
      </div>

      {/* Read-only calculated fields arranged in pairs */}
      <div className="grid grid-cols-2 gap-4"> {/* Use grid for better alignment */}
        {[ 
          { label: "Overtime Hours", name: "overtimeHours" },
          { label: "Overtime Amount", name: "overtimeAmount" },
          { label: "EPF Employee", name: "epfEmployee" },
          { label: "ETF Employer", name: "etfEmployer" },
          { label: "No Pay Leave Deduction", name: "noPayLeaveDeduction" },
          { label: "Gross Salary", name: "grossSalary" },
          { label: "Net Salary", name: "netSalary" }
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block text-gray-700 text-sm">{label}</label>
            <input
              type="number"
              name={name}
              value={formData[name]}
              readOnly
              className="mt-1 block w-full p-2 border rounded-md border-gray-300 bg-gray-100 text-sm"
            />
          </div>
        ))}
      </div>

      <button type="submit" className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200">
        Update Salary
      </button>
    </form>
  </div>
</div>

  

  );
};

export default SalaryUpdate;
