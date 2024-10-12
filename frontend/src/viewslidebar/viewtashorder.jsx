import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeAttendanceAndLeaveList = () => {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workingHours, setWorkingHours] = useState({});

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employee');
      setEmployees(response.data);
    } catch (error) {
      setError('Failed to fetch employee data.');
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await axios.get('/api/Leave');
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setError('Failed to fetch leave requests');
    }
  };

  const fetchAttendances = async () => {
    try {
      const response = await axios.get('/api/Attendence');
      setAttendances(response.data);
    } catch (err) {
      console.error('Error fetching attendances:', err);
      setError('Failed to fetch attendance records');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchEmployees();
      await fetchLeaves();
      await fetchAttendances();
      setLoading(false);
    };
    fetchData();
  }, []);

  const calculateWorkingHours = (attendanceData) => {
    const hours = {};
    attendanceData.forEach((att) => {
      const employeeId = att.empId;
      const date = new Date(att.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      const clockInTime = new Date(`1970-01-01T${att.clockIn}:00`);
      const clockOutTime = new Date(`1970-01-01T${att.clockOut}:00`);
      const workedHours = (clockOutTime - clockInTime) / (1000 * 60 * 60);

      if (!hours[employeeId]) hours[employeeId] = {};
      if (!hours[employeeId][monthYear]) hours[employeeId][monthYear] = 0;
      hours[employeeId][monthYear] += workedHours;
    });
    return hours;
  };

  useEffect(() => {
    if (attendances.length > 0) {
      const calculatedHours = calculateWorkingHours(attendances);
      setWorkingHours(calculatedHours);
    }
  }, [attendances]);

  const aggregateLeaves = () => {
    const leaveCount = {};
    leaves.forEach((leave) => {
      const empId = leave.empId;
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const totalLeaveDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      if (leaveCount[empId]) {
        leaveCount[empId].count += totalLeaveDays;
      } else {
        leaveCount[empId] = { count: totalLeaveDays };
      }
    });

    return Object.entries(leaveCount).map(([empId, { count }]) => ({
      empId,
      noPayLeaveDays: count > 40 ? count - 40 : 0,
    }));
  };

  const aggregatedLeaves = aggregateLeaves();

  const combinedData = employees.map((employee) => {
    const leaveData = aggregatedLeaves.find((leave) => leave.empId === employee.employeeId) || { noPayLeaveDays: 0 };
    const hoursData = workingHours[employee.employeeId] || {};
    const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const workedHours = hoursData[currentMonthYear] || 0;

    return {
      empId: employee.employeeId,
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.email,
      nic: employee.nic,
      department: employee.department,
      employeeType: employee.employeeType,
      designation: employee.designation,
      baseSalary: employee.baseSalary,
      noPayLeaveDays: leaveData.noPayLeaveDays,
      workedHours,
      overtime: workedHours > 180 ? (workedHours - 180).toFixed(2) : 0,
    };
  });

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Employee Attendance and Leave Information</h1>

      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
            <th className="py-3 px-6 text-left">Employee ID</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">NIC</th>
            <th className="py-3 px-6 text-left">Department</th>
            <th className="py-3 px-6 text-left">Employee Type</th>
            <th className="py-3 px-6 text-left">Designation</th>
            <th className="py-3 px-6 text-left">Base Salary (Rs)</th>
            <th className="py-3 px-6 text-left">Worked Hours</th>
            <th className="py-3 px-6 text-left">Overtime Hours</th>
            <th className="py-3 px-6 text-left">No-Pay Leave Days</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {combinedData.map((data, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{data.empId}</td>
              <td className="py-3 px-6 text-left">{data.name}</td>
              <td className="py-3 px-6 text-left">{data.email}</td>
              <td className="py-3 px-6 text-left">{data.nic}</td>
              <td className="py-3 px-6 text-left">{data.department}</td>
              <td className="py-3 px-6 text-left">{data.employeeType}</td>
              <td className="py-3 px-6 text-left">{data.designation}</td>
              <td className="py-3 px-6 text-left">Rs {data.baseSalary.toLocaleString()}</td>
              <td className="py-3 px-6 text-left">{data.workedHours.toFixed(2)} hrs</td>
              <td className="py-3 px-6 text-left">{data.overtime} hrs</td>
              <td className="py-3 px-6 text-left">{data.noPayLeaveDays}</td>
              <td className="py-3 px-6 text-center">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded">
                  Fill
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeAttendanceAndLeaveList;
