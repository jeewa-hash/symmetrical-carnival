import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SalaryUpdate from './salaryupdate';
import SalaryDetailModal from './viewsalary';
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from '../image/logo.png';
import backgr from '../image/BR.png'; 
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
  
    // Add Logo
    doc.addImage(logo, 'PNG', 14, 10, 50, 20); // Adjust the position and size as necessary
  
    // Add Title Next to Logo
    doc.setFontSize(18); // Set font size for the title
    doc.setFont("helvetica", "bold"); // Set font to bold
    doc.setTextColor(0, 51, 102); // Set color (blue to match soft toy theme)
    doc.text("Bear Works Lanka", 70, 20); // Position the title next to the logo
  
    // Draw Header Line
    doc.setDrawColor(0, 0, 0); // Set line color to black
    doc.line(14, 32, doc.internal.pageSize.width - 14, 32); // Draw line below the header
  
    // Add Salary Report Title
    doc.setFontSize(14); // Set font size for the report title
    doc.setFont("helvetica", "normal"); // Set font to normal
    doc.text(`Salary Report for ${month}`, 20, 40);
  
    // Create the table
    doc.autoTable({
      head: [['Employee Name', 'Employee ID', 'Department', 'Basic Salary', 'Gross Salary', 'Net Salary']],
      body: salaries.map((salary) => [
        salary.employeeName,
        salary.employeeId,
        salary.department,
        salary.basicSalary.toFixed(2), // Format as needed
        salary.grossSalary.toFixed(2), // Format as needed
        salary.netSalary.toFixed(2), // Format as needed
      ]),
      startY: 50, // Start position for the table
    });
  
    const totalNetSalary = calculateTotalNetSalary(salaries);
    doc.text(`Total Net Salary: ${totalNetSalary.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10); // Position total below the table
  
    // Draw Footer Line
    const footerY = doc.internal.pageSize.height - 30; // Position for footer line
    doc.line(14, footerY, doc.internal.pageSize.width - 14, footerY); // Draw line above the footer
  
    // Add Footer
    doc.setFontSize(12); // Set font size for footer
    doc.setFont("helvetica", "normal"); // Set font to normal
    doc.setTextColor(0, 0, 0); // Set color to black
    const footerText = "Address: 123 Bear Lane, Colombo, Sri Lanka\nContact: +94 123 456 789"; // Sample footer text
    const footerLines = doc.splitTextToSize(footerText, doc.internal.pageSize.width - 28); // Split text to fit the page
  
    // Draw footer text below the footer line
    doc.text(footerLines, 14, footerY + 10);
  
    // Save the PDF
    doc.save(`Salary_Report_${month}.pdf`);
  };
  

  return (
    
      <div className="p-6 bg-gray-100 rounded-lg shadow-md">
        <div className="bg-cover bg-center min-h-screen" style={{ backgroundImage: `url(${backgr})` }}>
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
            className="border rounded px-2 py-1 mr-2"
          >
            <option value="">All Departments</option>
            <option value="Sales and Marketing Department">Sales and Marketing Department</option>
            <option value="Production Department">Production Department</option>
            <option value="Supply Chain and Procurement Department">Supply Chain and Procurement Department</option>
            <option value="Finance Department">Finance Department</option>
            <option value="Order Management Department">Order Management Department</option>
            <option value="Human Resources Department">All Departments</option>
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
                      <td className="px-4 py-2">{salary.employeeName}</td>
                      <td className="px-4 py-2">{salary.employeeId}</td>
                      <td className="px-4 py-2">{salary.department}</td>
                      <td className="px-4 py-2">{salary.basicSalary.toFixed(2)}</td>
                      <td className="px-4 py-2">{salary.grossSalary.toFixed(2)}</td>
                      <td className="px-4 py-2">{salary.netSalary.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleEdit(salary)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(salary._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded"
                          onClick={() => handleView(salary)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 font-semibold">
                Total Net Salary for {month}: {calculateTotalNetSalary(groupedSalaries[month]).toFixed(2)}
              </div>
              {/* Generate PDF button for each month */}
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => generatePDF(month, groupedSalaries[month])}
              >
                Generate PDF
              </button>
            </div>
          ))
        )}
      </div>
      </div>
    );
    
  
};

export default SalaryDetailRetrievePage;
