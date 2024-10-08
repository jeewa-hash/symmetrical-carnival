import React, { useEffect, useState } from 'react';
import './Report.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation
import 'jspdf-autotable'; // For adding table to PDF

const Report = () => {
  const [listData, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/Report/list');
        setData(response.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const deleteReport = async (id) => {
    await axios
      .delete(`/api/Report/delete/${id}`)
      .then((response) => {
        setData(listData.filter((list) => list._id !== id));
        toast.success(response.data.message, { position: 'top-right' });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title to the PDF
    doc.text('Delivery Report', 14, 10);

    // Define table columns and rows
    const tableColumn = ['Delivery No', 'Driver Name', 'Vehicle No', 'Delivery Route', 'Delivery Date', 'Start Time', 'End Time', 'Delivery Status'];
    const tableRows = listData.map((list, index) => [
      index + 1,
      list.driver_Name,
      list.vehicel_No,
      list.delivery_Route,
      list.delivery_Date,
      list.delivery_StartTime,
      list.delivery_EndTime,
      list.delivery_Status,
    ]);

    // Add table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Adjust the starting point of the table
    });

    // Save the generated PDF
    doc.save('DeliveryReport.pdf');
  };

  // Filter listData based on the search term
  const filteredData = listData.filter((list) =>
    list.driver_Name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by driver name
  );

  return (
    <div className="deliverytable">
      <div className="search-bar mb-4">
        <input
          type="text"
          placeholder="Search by Driver Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          className="form-control border rounded-md p-2"
        />
      </div>

      <div className="mb-4">
        <Link to="/add" className="btn btn-primary bg-blue-500 text-white rounded-md px-4 py-2 mr-2">
          <i className="fa-solid fa-plus"></i> Add Report
        </Link>
        <Link to="/dashBoard" className="btn btn-primary bg-blue-500 text-white rounded-md px-4 py-2 mr-2">
          <i className="fa-solid fa-pen-to-square"></i> Dash Board
        </Link>
        <Link to="/map" className="btn btn-primary bg-blue-500 text-white rounded-md px-4 py-2">
          <i className="fa-solid fa-map-location-dot"></i> Map View
        </Link>
        <button onClick={generatePDF} type="button" className="btn btn-success bg-green-500 text-white rounded-md px-4 py-2 ml-2">
          <i className="fa-solid fa-file-pdf"></i> Generate Report
        </button>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th scope="col" className="border-b-2 border-gray-300 p-2">Delivery No</th>
            <th scope="col" className="border-b-2 border-gray-300 p-2">Driver Name</th>
            <th scope="col" className="border-b-2 border-gray-300 p-2">Vehicle No</th>
            <th scope="col" className="border-b-2 border-gray-300 p-2">Delivery Route</th>
            <th scope="col" className="border-b-2 border-gray-300 p-2">Delivery Date</th>
            <th scope="col" className="border-b-2 border-gray-300 p-2">Start Time</th>
            <th scope="col" className="border-b-2 border-gray-300 p-2">End Time</th>
            <th scope="col" className="border-b-2 border-gray-300 p-2">Delivery Status</th>
            <th scope="col" className="border-b-2 border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((list, index) => (
            <tr key={list._id}>
              <th scope="row" className="border-b border-gray-200 p-2">{index + 1}</th>
              <td className="border-b border-gray-200 p-2">{list.driver_Name}</td>
              <td className="border-b border-gray-200 p-2">{list.vehicel_No}</td>
              <td className="border-b border-gray-200 p-2">{list.delivery_Route}</td>
              <td className="border-b border-gray-200 p-2">{list.delivery_Date}</td>
              <td className="border-b border-gray-200 p-2">{list.delivery_StartTime}</td>
              <td className="border-b border-gray-200 p-2">{list.delivery_EndTime}</td>
              <td className="border-b border-gray-200 p-2">{list.delivery_Status}</td>
              <td className="border-b border-gray-200 p-2">
                <Link to={`/update/${list._id}`} className="bg-blue-500 text-white rounded-md px-2 py-1 mr-2">
                  <i className="fa-solid fa-pen-to-square"></i> Edit
                </Link>
                <button
                  onClick={() => deleteReport(list._id)}
                  className="bg-red-500 text-white rounded-md px-2 py-1"
                >
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
