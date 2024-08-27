import React, { useState } from 'react';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';

const AttendanceRetrieve = () => {
  // Initialize attendance state with an array of attendance objects
  const [attendances, setAttendances] = useState([
    { id: 1, empId: 'E001', name: 'John Doe', date: '2022-01-01', clockIn: '09:00', clockOut: '17:00', status: 'Present' },
    { id: 2, empId: 'E002', name: 'Jane Doe', date: '2022-02-01', clockIn: '09:15', clockOut: '17:15', status: 'Present' },
    { id: 3, empId: 'E003', name: 'Bob Smith', date: '2022-03-01', clockIn: '09:30', clockOut: '17:30', status: 'Absent' },
  ]);

  const [filteredAttendances, setFilteredAttendances] = useState(attendances);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const filtered = attendances.filter((attendance) =>
      attendance.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAttendances(filtered);
  };

  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    const filtered = attendances.filter((attendance) =>
      status ? attendance.status === status : true
    );
    setFilteredAttendances(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('');
    setFilteredAttendances(attendances);
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Attendance Retrieving and Filtering</h1>
      <div className="flex justify-between mb-4">
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name"
          className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2 pl-10 text-sm text-gray-700"
        />
        <select
          value={statusFilter}
          onChange={handleStatusFilter}
          className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2 pl-10 text-sm text-gray-700"
        >
          <option value="">All Statuses</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <button onClick={handleReset} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Reset
        </button>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Employee ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Clock In</th>
            <th className="px-4 py-2">Clock Out</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendances.map((attendance) => (
            <tr key={attendance.id}>
              <td className="border px-4 py-2">{attendance.id}</td>
              <td className="border px-4 py-2">{attendance.empId}</td>
              <td className="border px-4 py-2">{attendance.name}</td>
              <td className="border px-4 py-2">{attendance.date}</td>
              <td className="border px-4 py-2">{attendance.clockIn}</td>
              <td className="border px-4 py-2">{attendance.clockOut}</td>
              <td className="border px-4 py-2">{attendance.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Footer />
    </div>
  );
};

export default AttendanceRetrieve;
