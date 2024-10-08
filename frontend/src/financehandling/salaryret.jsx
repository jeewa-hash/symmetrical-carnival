import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SalaryUpdate from './salaryupdate';
import SalaryDetailModal from './viewsalary';
import jsPDF from "jspdf";
import "jspdf-autotable";

const SalaryDetailRetrievePage = () => {
  const [salaryDetails, setSalaryDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [message, setMessage] = useState(null);
  
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewedSalary, setViewedSalary] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalaryDetails = async () => {
      try {
        const response = await axios.get('/api/salarycalculates');
        setSalaryDetails(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryDetails();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const groupSalariesByMonth = (salaries) => {
    return salaries.reduce((acc, salary) => {
      const month = salary.payrollMonth;
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(salary);
      return acc;
    }, {});
  };

  const filteredSalaries = salaryDetails.filter((salary) => {
    const matchesId = salary.employeeId.toString().includes(searchQuery);
    const matchesDepartment = departmentFilter ? salary.department === departmentFilter : true;
    return matchesId && matchesDepartment;
  });

  const groupedSalaries = groupSalariesByMonth(filteredSalaries);

  const sortMonths = (months) => {
    return Object.keys(months).sort((a, b) => new Date(b) - new Date(a));
  };

  const handleEdit = (salary) => {
    setSelectedSalary(salary);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`/api/salarycalculates/${id}`);
        if (response.status === 200) {
          setSalaryDetails(salaryDetails.filter(salary => salary._id !== id));
          setMessage(response.data.message || 'Employee salary record deleted successfully.');
        }
      } catch (error) {
        console.error('Error deleting employee salary record:', error);
        alert('Error deleting employee salary record: ' + (error.response?.data.message || error.message));
      }
    }
  };

  const handleUpdateSalary = (updatedSalary) => {
    setSalaryDetails(salaryDetails.map(salary => (salary._id === updatedSalary._id ? updatedSalary : salary)));
    setModalOpen(false);
  };

  const handleView = (salary) => {
    setViewedSalary(salary);
    setViewModalOpen(true);
  };

  const calculateTotalNetSalary = (salaries) => {
    return salaries.reduce((total, salary) => total + salary.netSalary, 0);
  };

  const generatePDF = (month, salaries) => {
    const doc = new jsPDF();
    doc.text(`Salary Report for ${month}`, 20, 10);
    doc.autoTable({
      head: [['Employee Name', 'Employee ID', 'Department', 'Basic Salary', 'Gross Salary', 'Net Salary']],
      body: salaries.map((salary) => [
        salary.employeeName,
        salary.employeeId,
        salary.department,
        salary.basicSalary,
        salary.grossSalary,
        salary.netSalary,
      ]),
    });
    const totalNetSalary = calculateTotalNetSalary(salaries);
    doc.text(`Total Net Salary: ${totalNetSalary}`, 20, doc.lastAutoTable.finalY + 10);
    doc.save(`Salary_Report_${month}.pdf`);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      {isModalOpen && (
        <SalaryUpdate
          salary={selectedSalary}
          onClose={() => setModalOpen(false)}
          onUpdate={handleUpdateSalary}
        />
      )}
      
      {isViewModalOpen && (
        <SalaryDetailModal
          salary={viewedSalary}
          onClose={() => setViewModalOpen(false)}
        />
      )}

      {message && <div className="mb-4 text-green-600">{message}</div>}
      <h2 className="text-2xl font-bold mb-4">Salary Details</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Employee ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-2 py-1 mr-2"
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">All Departments</option>
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
        </select>
      </div>
      {Object.keys(groupedSalaries).length === 0 ? (
        <p>No salary details found.</p>
      ) : (
        sortMonths(groupedSalaries).map((month) => (
          <div key={month} className="mb-6 bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-xl font-semibold mb-2">Payroll Month: {month}</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Employee Name</th>
                  <th className="px-4 py-2 text-left">Employee ID</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Basic Salary</th>
                  <th className="px-4 py-2 text-left">Gross Salary</th>
                  <th className="px-4 py-2 text-left">Net Salary</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedSalaries[month].map((salary) => (
                  <tr key={salary._id}>
                    <td className="px-4 py-2 border-b">{salary.employeeName}</td>
                    <td className="px-4 py-2 border-b">{salary.employeeId}</td>
                    <td className="px-4 py-2 border-b">{salary.department}</td>
                    <td className="px-4 py-2 border-b">{salary.basicSalary}</td>
                    <td className="px-4 py-2 border-b">{salary.grossSalary}</td>
                    <td className="px-4 py-2 border-b">{salary.netSalary}</td>
                    <td className="px-4 py-2 border-b">
                      <button onClick={() => handleView(salary)} className="text-green-500 hover:underline mr-2">View</button>
                      <button onClick={() => handleEdit(salary)} className="text-blue-500 hover:underline mr-2">Edit</button>
                      <button onClick={() => handleDelete(salary._id)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <p className="font-semibold">Total Net Salary: {calculateTotalNetSalary(groupedSalaries[month])}</p>
              <button onClick={() => generatePDF(month, groupedSalaries[month])} className="mt-2 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600">
                Generate PDF
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SalaryDetailRetrievePage;
