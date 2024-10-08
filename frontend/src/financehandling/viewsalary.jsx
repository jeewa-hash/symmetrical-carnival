import React from 'react';

const SalaryDetailModal = ({ salary, onClose }) => {
  if (!salary) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg w-2/3 max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Payslip for {salary.payrollMonth}</h2>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Employee Name:</span>
            <span>{salary.employeeName}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Employee ID:</span>
            <span>{salary.employeeId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">NIC:</span>
            <span>{salary.nic}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Email:</span>
            <span>{salary.email}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Department:</span>
            <span>{salary.department}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Payroll Month:</span>
            <span>{salary.payrollMonth}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold mt-6 mb-4">Salary Breakdown</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><strong>Basic Salary:</strong> {salary.basicSalary}</div>
          <div><strong>Actual Hours:</strong> {salary.actualHours}</div>
          <div><strong>Overtime Hours:</strong> {salary.overtimeHours}</div>
          <div><strong>Unpaid Leave Days:</strong> {salary.unpaidLeaveDays}</div>
          <div><strong>No-Pay Leave Deduction:</strong> {salary.noPayLeaveDeduction}</div>
          <div><strong>Allowances:</strong> {salary.allowances}</div>
          <div><strong>Bonuses:</strong> {salary.bonuses}</div>
          <div><strong>Medical Insurance:</strong> {salary.medicalInsurance}</div>
          <div><strong>EPF (Employee):</strong> {salary.epfEmployee}</div>
          <div><strong>ETF (Employer):</strong> {salary.etfEmployer}</div>
          <div><strong>Overtime Amount:</strong> {salary.overtimeAmount}</div>
          <div><strong>Gross Salary:</strong> {salary.grossSalary}</div>
          <div><strong>Net Salary:</strong> {salary.netSalary}</div>
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Close</button>
        </div>
      </div>
    </div>
  );
};

export default SalaryDetailModal;
