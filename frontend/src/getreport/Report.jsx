import React, { useEffect, useState } from 'react';
import './Report.css'; // Make sure this file includes the styles
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation
import 'jspdf-autotable'; // For adding table to PDF

import BR1 from '../image/BR.png'
import image from '../image/logo.png';


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
  
    // Add Logo (Assuming you have a logo variable)
    doc.addImage( image, 'PNG', 14, 10, 50, 20); 
  
    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102);
    doc.text('Bear Works Lanka', 70, 20); 
  
    // Draw line
    doc.setDrawColor(0, 0, 0);
    doc.line(14, 32, doc.internal.pageSize.width - 14, 32);
  
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
  
    // Add table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40, // Adjusted to leave space for header
    });
  
    // Footer
    const footerY = doc.internal.pageSize.height - 30;
    doc.line(14, footerY, doc.internal.pageSize.width - 14, footerY);
    doc.setFontSize(12);
    const footerText = "Address: 123 Bear Lane, Colombo, Sri Lanka\nContact: +94 123 456 789";
    const footerLines = doc.splitTextToSize(footerText, doc.internal.pageSize.width - 28);
    doc.text(footerLines, 14, footerY + 10);
  
    // Save PDF
    doc.save('DeliveryReport.pdf');
  };
  

  // Filter listData based on the search term
  const filteredData = listData.filter((list) =>
    list.driver_Name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by driver name
  );

  return (
  <div className='bg-cover min-h-screen bg-no-repeat' style={{backgroundImage: `url(${BR1})`}}>
    
    <div className="report-container"> {/* Replacing inline styles with a class */}
    
      
      <div className="deliverytable bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
        <div className="search-bar mb-4">
          <input
            type="text"
            placeholder="Search by Driver Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            className="form-control p-2 rounded-lg"
          />
        </div>

        <div className="buttons mb-4 flex space-x-4">

          <button onClick={generatePDF} type="button" className="btn btn-success">
            <i className="fa-solid fa-file-pdf"></i> Generate Report
          </button>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Delivery No</th>
              <th scope="col">Driver Name</th>
              <th scope="col">Vehicle No</th>
              <th scope="col">Delivery Route</th>
              <th scope="col">Delivery Date</th>
              <th scope="col">Start Time</th>
              <th scope="col">End Time</th>
              <th scope="col">Delivery Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((list, index) => (
              <tr key={list._id}>
                <th scope="row">{index + 1}</th>
                <td>{list.driver_Name}</td>
                <td>{list.vehicel_No}</td>
                <td>{list.delivery_Route}</td>
                <td>{list.delivery_Date}</td>
                <td>{list.delivery_StartTime}</td>
                <td>{list.delivery_EndTime}</td>
                <td>{list.delivery_Status}</td>
                <td>
                  <Link to={`/update/${list._id}`}  type="button" className="bg-green-500 text-white px-4 py-2 rounded mt-4">
                  Update
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                  <button
                    onClick={() => deleteReport(list._id)}
                    type="button"
                    className="bg-purple-500 text-white px-4 py-2 rounded mt-4"
                  >
                    Delet
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
   
  </div>  
  );
};

export default Report;
