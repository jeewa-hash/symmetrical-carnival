import React, { useState } from 'react';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';

// Salary details as plain JavaScript objects
const SalaryDetailsTable = () => {
  const [salaryDetails, setSalaryDetails] = useState([
    { id: 1, empId: 'EMP001', name: 'John Doe', baseSalary: 40000, otHours: 10, allowances: 5000, department: 'IT' },
    { id: 2, empId: 'EMP002', name: 'Jane Doe', baseSalary: 45000, otHours: 8, allowances: 6000, department: 'Marketing' },
    { id: 3, empId: 'EMP003', name: 'Bob Smith', baseSalary: 50000, otHours: 12, allowances: 7000, department: 'Sales' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredSalaryDetails = salaryDetails.filter((detail) => {
    const name = detail.name.toLowerCase();
    const department = detail.department.toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || department.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Salary Details Retrieving Table</h1>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name or department"
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
      />
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Employee ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Base Salary</th>
            <th className="px-4 py-2 text-left">OT Hours</th>
            <th className="px-4 py-2 text-left">Allowances</th>
            <th className="px-4 py-2 text-left">Department</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalaryDetails.map((detail) => (
            <tr key={detail.id}>
              <td className="px-4 py-2 border border-gray-300">{detail.id}</td>
              <td className="px-4 py-2 border border-gray-300">{detail.empId}</td>
              <td className="px-4 py-2 border border-gray-300">{detail.name}</td>
              <td className="px-4 py-2 border border-gray-300">{detail.baseSalary}</td>
              <td className="px-4 py-2 border border-gray-300">{detail.otHours}</td>
              <td className="px-4 py-2 border border-gray-300">{detail.allowances}</td>
              <td className="px-4 py-2 border border-gray-300">{detail.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Footer />
    </div>
  );
};

export default SalaryDetailsTable;
