import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../image/logo.png'; // Update the path as necessary
import backgr from '../image/bbk.png';


const ProductionList = () => {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [batchDateQueries, setBatchDateQueries] = useState({});
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: '',
    name: '',
    quantity: '',
    status: '',
    productionDate: '',
    batch: ''
  });
  const [errors, setErrors] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const response = await axios.get('/api/products');
        // Sort productions by productionDate in descending order (latest first)
        const sortedProductions = response.data.sort((a, b) => new Date(b.productionDate) - new Date(a.productionDate));
        setProductions(sortedProductions);
      } catch (err) {
        setError('Failed to fetch productions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductions();
  }, []);

  const groupByBatchAndDate = (productions) => {
    return productions.reduce((acc, production) => {
      const date = production.productionDate;
      const batch = production.batch;

      if (!acc[batch]) {
        acc[batch] = {};
      }
      if (!acc[batch][date]) {
        acc[batch][date] = { totalQuantity: 0, productions: [] };
      }

      acc[batch][date].totalQuantity += production.quantity;
      acc[batch][date].productions.push(production);

      return acc;
    }, {});
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBatchDateChange = (date) => {
    setBatchDateQueries((prev) => ({
      ...prev,
      date,
    }));
  };

  const filterProductions = (productions, query, dateQuery) => {
    return productions.filter((production) => {
      const matchesNameOrId =
        production.name.toLowerCase().includes(query.toLowerCase()) ||
        production._id.toLowerCase().includes(query.toLowerCase());

      const matchesDate = dateQuery ? production.productionDate === dateQuery : true;

      return matchesNameOrId && matchesDate;
    });
  };

  const filteredProductions = filterProductions(productions, searchQuery, batchDateQueries.date);
  const groupedProductions = groupByBatchAndDate(filteredProductions);

  const handleView = (production) => {
    setSelectedProduction(production);
    setIsViewModalOpen(true);
  };

  const handleEdit = (production) => {
    setSelectedProduction(production);
    setEditFormData({
      _id: production._id,
      name: production.name,
      quantity: production.quantity,
      status: production.status,
      productionDate: production.productionDate,
      batch: production.batch
    });
    setIsEditMode(true);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduction(null);
    setIsEditMode(false);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setErrors({});
    setEditFormData({
      _id: '',
      name: '',
      quantity: '',
      status: '',
      productionDate: '',
      batch: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editFormData.status) newErrors.status = 'Status is required';
    if (!editFormData.name) newErrors.name = 'Name is required';
    if (!editFormData.quantity) newErrors.quantity = 'Quantity is required';
    if (!editFormData.productionDate) newErrors.productionDate = 'Production date is required';
    if (!editFormData.batch) newErrors.batch = 'Batch is required';
    return newErrors;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const updatedData = { ...editFormData };

    try {
      await axios.put(`/api/products/${editFormData._id}`, updatedData);
      setProductions(
        productions.map((production) =>
          production._id === editFormData._id ? { ...production, ...updatedData } : production
        )
      );
      handleCloseModal();
    } catch (err) {
      console.error('Failed to update production', err);
      setError('Failed to update production');
    }
  };

  const handleDelete = async (productionId) => {
    if (window.confirm('Are you sure you want to delete this production?')) {
      try {
        await axios.delete(`/api/products/${productionId}`);
        setProductions(productions.filter((production) => production._id !== productionId));
      } catch (err) {
        console.error('Failed to delete production', err);
        setError('Failed to delete production');
      }
    }
  };const handleDownloadBatchPDF = (batch) => {
    const doc = new jsPDF();

    // Add Logo
    doc.addImage(logo, 'PNG', 14, 10, 50, 20); // Adjust the position and size as necessary

    // Add Title Next to Logo
    doc.setFontSize(18); // Set font size for the title
    doc.setFont("helvetica", "bold"); // Set font to bold
    doc.setTextColor(0, 51, 102); // Set color (pink to match soft toy theme)
    doc.text("Bear Works Lanka", 70, 20); // Position the title next to the logo

    // Draw Header Line
    doc.setDrawColor(0, 0, 0); // Set line color to black
    doc.line(14, 32, doc.internal.pageSize.width - 14, 32); // Draw line below the header

    // Reset font for the report title
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14); // Set font size for report title
    doc.setTextColor(0, 0, 0); // Set color to black
    doc.text(`Production List for Batch: ${batch}`, 14, 50); // Adjust position for batch title

    const batchProductions = groupedProductions[batch] ? 
        groupedProductions[batch][Object.keys(groupedProductions[batch])[0]].productions : [];

    // Add Table
    autoTable(doc, {
        head: [['Name', 'Quantity', 'Status', 'Production Date']],
        body: batchProductions.map((production) => [
            production.name,
            production.quantity,
            production.status,
            production.productionDate,
        ]),
        startY: 60, // Adjust the starting Y position after the title
    });

    // Draw Footer Line
    const footerY = doc.internal.pageSize.height - 30; // Position for footer line
    doc.line(14, footerY, doc.internal.pageSize.width - 14, footerY); // Draw line above the footer

    // Add Footer
    doc.setFontSize(12); // Set font size for footer
    doc.setFont("helvetica", "normal"); // Set font to normal
    doc.setTextColor(0, 0, 0); // Set color to black
    const footerText = "Address: 123 Bear Lane, Colombo, Sri Lanka\nContact: +94 123 456 789"; // Sample footer text
    const footerLines = doc.splitTextToSize(footerText, doc.internal.pageSize.width - 28); // Split text to fit the page

    doc.text(footerLines, 14, footerY + 10); // Draw footer text below the footer line

    // Save the PDF
    doc.save(`production_list_batch_${batch}.pdf`);
};



  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    
    <div
    className="min-h-screen bg-cover bg-center"
    style={{
      // Background image added here
      backgroundImage: `url(${backgr})`,
    }}
  >
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Production List</h2>

        {/* Search Inputs */}
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 justify-center">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
          />
          <input
            type="date"
            onChange={(e) => handleBatchDateChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
          />
        </div>

        <div className="space-y-6">
          {Object.keys(groupedProductions).map((batch) => {
            const dates = Object.keys(groupedProductions[batch]);
            return (
              <div key={batch} className="bg-red-50 p-4 rounded-lg shadow-md mb-4 border border-gray-300">
               <h3 className="text-3xl font-bold text-blue-800 mb-4">Batch: {batch}</h3>

                <button
                  onClick={() => handleDownloadBatchPDF(batch)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mb-2 transition duration-200"
                >
                  Download Batch PDF
                </button>
                {dates.map((date) => (
  <div key={date} className="mb-4">
    <h4 className="text-lg font-semibold text-gray-600 mb-2">Date: {date}</h4>
    <p className="text-black font-bold">Total Quantity: {groupedProductions[batch][date].totalQuantity}</p>

    <table className="min-w-full bg-white border border-gray-300 mt-2">
      <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-4 border-b text-left">Name</th>
          <th className="py-2 px-4 border-b text-left">Quantity</th>
          <th className="py-2 px-4 border-b text-left">Status</th>
          <th className="py-2 px-4 border-b text-left">Production Date</th>
          <th className="py-2 px-4 border-b text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {groupedProductions[batch][date].productions.map((production) => (
          <tr key={production._id} className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b">{production.name}</td>
            <td className="py-2 px-4 border-b">{production.quantity}</td>
            <td className="py-2 px-4 border-b">{production.status}</td>
            <td className="py-2 px-4 border-b">{production.productionDate}</td>
            <td className="py-2 px-4 border-b">
              <button
                onClick={() => handleView(production)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition duration-200"
              >
                View
              </button>
              <button
                onClick={() => handleEdit(production)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded transition duration-200 ml-2"
                disabled={production.status === 'Done'}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(production._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded transition duration-200 ml-2"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
))}

              
              </div>
            );
          })}
        </div>
        {/* Edit Modal */}
{isEditModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Edit Production</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={editFormData.name}
            onChange={handleInputChange}
            readOnly
            className={`w-full p-2 border border-gray-300 rounded-lg ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={editFormData.quantity}
            onChange={handleInputChange}
            readOnly
            className={`w-full p-2 border border-gray-300 rounded-lg ${errors.quantity ? 'border-red-500' : ''}`}
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Status</label>
          <select
            name="status"
            value={editFormData.status}
            onChange={handleInputChange} // Allow the status to be changed
            className={`w-full p-2 border border-gray-300 rounded-lg ${errors.status ? 'border-red-500' : ''}`}
          >
            <option value="">Select status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Production Date</label>
          <input
            type="date"
            name="productionDate"
            value={editFormData.productionDate}
            onChange={handleInputChange}
            readOnly
            className={`w-full p-2 border border-gray-300 rounded-lg ${errors.productionDate ? 'border-red-500' : ''}`}
          />
          {errors.productionDate && <p className="text-red-500 text-sm">{errors.productionDate}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Batch</label>
          <input
            type="text"
            name="batch"
            value={editFormData.batch}
            onChange={handleInputChange}
            readOnly
            className={`w-full p-2 border border-gray-300 rounded-lg ${errors.batch ? 'border-red-500' : ''}`}
          />
          {errors.batch && <p className="text-red-500 text-sm">{errors.batch}</p>}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCloseModal}
            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-3 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded"
          >
            Update
          </button>
        </div>
      </form>
    </div> 
  </div>
)}{/* View Modal */}
{isViewModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">View Production Details</h2>
      {selectedProduction && (
        <div>
          <p><strong>Name:</strong> {selectedProduction.name}</p>
          <p><strong>Quantity:</strong> {selectedProduction.quantity}</p>
          <p><strong>Status:</strong> {selectedProduction.status}</p>
          <p><strong>Production Date:</strong> {selectedProduction.productionDate}</p>
          <p><strong>Batch:</strong> {selectedProduction.batch}</p>
        </div>
      )}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleCloseModal}
          className="bg-blue-500 hover:bg-blue-600 text-black font-semibold py-1 px-3 rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      </div>
      
    </div>
  );
};

export default ProductionList;
