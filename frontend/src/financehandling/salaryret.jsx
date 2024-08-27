import React, { useState } from 'react';
import Header from "../Shared/Header";
import Footer from '../Shared/Footer';
import './salaryret.css'; // Import the CSS file

const SalaryDetailRetrievePage = () => {
  const [salaryDetails, setSalaryDetails] = useState([
    { id: 1, employeeName: 'John Doe', salary: 5000, paymentDate: '2022-01-01' },
    { id: 2, employeeName: 'Jane Doe', salary: 6000, paymentDate: '2022-02-01' },
    { id: 3, employeeName: 'Bob Smith', salary: 7000, paymentDate: '2022-03-01' },
  ]);

  const handleEdit = (salaryDetail) => {
    // Implement edit logic here
    console.log(`Edit: ${salaryDetail.id}`);
  };

  const handleDelete = (salaryDetail) => {
    // Implement delete logic here
    console.log(`Delete: ${salaryDetail.id}`);
    setSalaryDetails(salaryDetails.filter(detail => detail.id !== salaryDetail.id));
  };

  return (
    <div>
      <Header />

      <div className="max-w-7xl mx-auto p-4 bg-white rounded-md shadow-md">
        <h2 className="text-3xl font-bold mb-4">Salary Detail Retrieve Page</h2>
        <div className="flex flex-wrap justify-center mb-4">
          <div className="w-full md:w-1/2 xl:w-1/3 p-4">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Employee Name</th>
                  <th className="px-4 py-2">Salary</th>
                  <th className="px-4 py-2">Payment Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {salaryDetails.map((salaryDetail) => (
                  <tr key={salaryDetail.id}>
                    <td className="px-4 py-2">{salaryDetail.employeeName}</td>
                    <td className="px-4 py-2">{salaryDetail.salary}</td>
                    <td className="px-4 py-2">{salaryDetail.paymentDate}</td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleEdit(salaryDetail)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleDelete(salaryDetail)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SalaryDetailRetrievePage;
