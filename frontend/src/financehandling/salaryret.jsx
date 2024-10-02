import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './salaryret.css'; // Include your style
import Salaryupdate from './salaryupdate'; // Make sure this is the correct import

const SalaryDetailRetrievePage = () => {
  const [salaryDetails, setSalaryDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [message, setMessage] = useState(null);
  
  // States for the update modal
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

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

  const filteredSalaries = salaryDetails.filter((salary) => {
    const matchesId = salary.employeeId.toString().includes(searchQuery);
    const matchesDepartment = departmentFilter ? salary.department === departmentFilter : true;
    return matchesId && matchesDepartment;
  });

  const handleEdit = (salary) => {
    setSelectedSalary(salary);
    setModalOpen(true); // Open the modal to update the salary
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`/api/salarycalculates/${id}`);  // Use id
        
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
    setModalOpen(false); // Close modal after update
  };

  return (
    <div className="salary-detail-container">
      {/* Render the update salary modal */}
      {isModalOpen && (
        <Salaryupdate
          salary={selectedSalary}
          onClose={() => setModalOpen(false)}
          onUpdate={handleUpdateSalary}
        />
      )}
      {message && <div className="message">{message}</div>}
      <h2>Salary Details</h2>
      <div>
        <input
          type="text"
          placeholder="Search by Employee ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
        </select>
      </div>
      {filteredSalaries.length === 0 ? (
        <p>No salary details found.</p>
      ) : (
        <table className="salary-detail-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Basic Salary</th>
              <th>Gross Salary</th>
              <th>Net Salary</th>
              <th>Payroll Month</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((salary) => (
              <tr key={salary._id}> {/* Use _id as the key */}
                <td>{salary.employeeName}</td>
                <td>{salary.employeeId}</td>
                <td>{salary.department}</td>
                <td>{salary.basicSalary}</td>
                <td>{salary.grossSalary}</td>
                <td>{salary.netSalary}</td>
                <td>{salary.payrollMonth}</td>
                <td>
                  <button onClick={() => handleEdit(salary)}>Edit</button>
                  <button onClick={() => handleDelete(salary._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalaryDetailRetrievePage;
