import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../Shared/Header";
import Footer from '../Shared/Footer';

const SalaryCalculator = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [basicSalary, setBasicSalary] = useState(0);
  const [allowances, setAllowances] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [grossSalary, setGrossSalary] = useState(0);
  const [netSalary, setNetSalary] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Recalculate gross salary whenever basicSalary or allowances change
    setGrossSalary(basicSalary + allowances);
  }, [basicSalary, allowances]);

  useEffect(() => {
    // Recalculate net salary whenever grossSalary or deductions change
    setNetSalary(grossSalary - deductions);
  }, [grossSalary, deductions]);

  const handleNext = () => {
    navigate('/nextsalarycalculateinterface'); // Replace with your desired path
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <Header />
      <main className="flex-1 p-4">
        <div className="flex justify-center mb-4">
          <div className="w-1/2 bg-gray-100 p-4 rounded-md shadow-md mr-4">
            <h2 className="text-xl font-bold mb-4">Employee Details</h2>
            <form>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeName">
                Employee Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="employeeName"
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeId">
                Employee ID
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                Designation
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </form>
          </div>
          <div className="w-1/2 bg-gray-100 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Salary Details</h2>
            <form>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="basicSalary">
                Basic Salary
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="basicSalary"
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
              />
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allowances">
                Allowances
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="allowances"
                type="number"
                value={allowances}
                onChange={(e) => setAllowances(Number(e.target.value))}
              />
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deductions">
                Deductions
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="deductions"
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
              />
            </form>
            <p className="text-2xl font-bold mb-4">Gross Salary: ${grossSalary}</p>
            <p className="text-2xl font-bold mb-4">Net Salary: ${netSalary}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleNext}
            >
              View All Record
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SalaryCalculator;
