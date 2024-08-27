import React, { useState } from 'react';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';

const LeaveRetrieve = () => {
  // Initialize leaves state with an array of leave objects
  const [leaves, setLeaves] = useState([
    { id: 1, empId: 'E001', name: 'John Doe', startDate: '2022-01-01', endDate: '2022-01-10', reason: 'Vacation', type: 'Annual Leave' },
    { id: 2, empId: 'E002', name: 'Jane Doe', startDate: '2022-02-01', endDate: '2022-02-10', reason: 'Health', type: 'Sick Leave' },
    { id: 3, empId: 'E003', name: 'Bob Smith', startDate: '2022-03-01', endDate: '2022-03-10', reason: 'Maternity', type: 'Maternity Leave' },
  ]);

  const [filteredLeaves, setFilteredLeaves] = useState(leaves);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const filtered = leaves.filter((leave) =>
      leave.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLeaves(filtered);
  };

  const handleTypeFilter = (e) => {
    const type = e.target.value;
    setTypeFilter(type);
    const filtered = leaves.filter((leave) =>
      type ? leave.type === type : true
    );
    setFilteredLeaves(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setTypeFilter('');
    setFilteredLeaves(leaves);
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Leave Retrieving and Filtering</h1>
      <div className="flex justify-between mb-4">
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name"
          className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2 pl-10 text-sm text-gray-700"
        />
        <select
          value={typeFilter}
          onChange={handleTypeFilter}
          className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2 pl-10 text-sm text-gray-700"
        >
          <option value="">All Types</option>
          <option value="Annual Leave">Annual Leave</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Maternity Leave">Maternity Leave</option>
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
            <th className="px-4 py-2">Start Date</th>
            <th className="px-4 py-2">End Date</th>
            <th className="px-4 py-2">Reason</th>
            <th className="px-4 py-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.map((leave) => (
            <tr key={leave.id}>
              <td className="border px-4 py-2">{leave.id}</td>
              <td className="border px-4 py-2">{leave.empId}</td>
              <td className="border px-4 py-2">{leave.name}</td>
              <td className="border px-4 py-2">{leave.startDate}</td>
              <td className="border px-4 py-2">{leave.endDate}</td>
              <td className="border px-4 py-2">{leave.reason}</td>
              <td className="border px-4 py-2">{leave.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Footer/>
    </div>
  );
};

export default LeaveRetrieve;
