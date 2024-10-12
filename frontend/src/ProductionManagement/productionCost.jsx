import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from '../image/design.png'; // Ensure the path to the image is correct

const ProductionCostCalculator = () => {
  const [productName, setProductName] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [overheadCost, setOverheadCost] = useState('');
  const [waterCost, setWaterCost] = useState('');
  const [currentBill, setCurrentBill] = useState('');
  const [entries, setEntries] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEntries, setShowEntries] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('productName');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/productionCost');
      setEntries(response.data);
      setShowEntries(true);
      setSuccessMessage('');
    } catch (error) {
      console.error('Error fetching entries!', error);
    } finally {
      setLoading(false);
    }
  };

  const isPositiveNumber = (value) => {
    return /^\d+(\.\d{1,2})?$/.test(value) && Number(value) >= 0;
  };

  const validateForm = () => {
    if (!productName.trim()) return false;
    if (!isPositiveNumber(materialCost)) return false;
    if (!isPositiveNumber(laborCost)) return false;
    if (!isPositiveNumber(overheadCost)) return false;
    if (!isPositiveNumber(waterCost)) return false;
    if (!isPositiveNumber(currentBill)) return false;
    return true;
  };

  const calculateTotalCost = () => {
    return (
      (isPositiveNumber(materialCost) ? Number(materialCost) : 0) +
      (isPositiveNumber(laborCost) ? Number(laborCost) : 0) +
      (isPositiveNumber(overheadCost) ? Number(overheadCost) : 0) +
      (isPositiveNumber(waterCost) ? Number(waterCost) : 0) +
      (isPositiveNumber(currentBill) ? Number(currentBill) : 0)
    ).toFixed(2);
  };

  const handleAddOrUpdateEntry = async () => {
    if (!validateForm()) {
      return;
    }

    const newEntry = {
      productName,
      materialCost,
      laborCost,
      overheadCost,
      waterCost,
      currentBill,
      totalCost: calculateTotalCost(),
    };

    setLoading(true);
    try {
      if (editIndex !== null) {
        await axios.put(`/api/productionCost/${entries[editIndex]._id}`, newEntry);
        const updatedEntries = entries.map((entry, index) =>
          index === editIndex ? newEntry : entry
        );
        setEntries(updatedEntries);
        setSuccessMessage('Entry updated successfully!');
        setEditIndex(null);
      } else {
        const response = await axios.post('/api/productionCost', newEntry);
        setEntries([...entries, response.data]);
        setSuccessMessage('New entry added successfully!');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving entry!', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductName('');
    setMaterialCost('');
    setLaborCost('');
    setOverheadCost('');
    setWaterCost('');
    setCurrentBill('');
  };

  const handleEdit = (index) => {
    const entry = entries[index];
    setProductName(entry.productName);
    setMaterialCost(entry.materialCost);
    setLaborCost(entry.laborCost);
    setOverheadCost(entry.overheadCost);
    setWaterCost(entry.waterCost);
    setCurrentBill(entry.currentBill);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setLoading(true);
      try {
        await axios.delete(`/api/productionCost/${entries[index]._id}`);
        const updatedEntries = entries.filter((_, i) => i !== index);
        setEntries(updatedEntries);
        setSuccessMessage('Entry deleted successfully!');
        if (editIndex === index) {
          resetForm();
          setEditIndex(null);
        }
      } catch (error) {
        console.error('Error deleting entry!', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleShowEntries = () => {
    setShowEntries((prev) => !prev);
  };

  const handleNumericInput = (setter) => (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleSort = (field) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    setSortField(field);
    setEntries(entries.sort((a, b) => {
      if (newSortOrder === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    }));
  };

  const filteredEntries = entries.filter(entry =>
    entry.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="flex flex-col min-h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex-1 flex justify-center items-center z-10">
        <div className="max-w-xl w-full bg-pink-100 rounded-lg shadow-xl p-10 border border-gray-200 space-y-6">
          <h2 className="text-4xl font-bold text-purple-600 mb-4 text-center">Production Cost Calculator</h2>
          <form className="space-y-4">
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            {loading && <p className="text-gray-500">Loading...</p>}
            <div>
              <label htmlFor="productName" className="block text-lg font-semibold text-gray-700">Product Name:</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {[
              { id: 'materialCost', label: 'Material Cost (RS):', value: materialCost, setter: handleNumericInput(setMaterialCost), placeholder: 'Enter material cost' },
              { id: 'laborCost', label: 'Labor Cost (RS):', value: laborCost, setter: handleNumericInput(setLaborCost), placeholder: 'Enter labor cost' },
              { id: 'overheadCost', label: 'Overhead Cost (RS):', value: overheadCost, setter: handleNumericInput(setOverheadCost), placeholder: 'Enter overhead cost' },
              { id: 'waterCost', label: 'Machine wastage Cost (RS):', value: waterCost, setter: handleNumericInput(setWaterCost), placeholder: 'Enter Water cost' },
              { id: 'currentBill', label: 'Electricity Bill (RS):', value: currentBill, setter: handleNumericInput(setCurrentBill), placeholder: 'Enter Electricity cost' }
            ].map(({ id, label, value, setter, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-lg font-semibold text-gray-700">{label}</label>
                <input
                  type="text"
                  id={id}
                  value={value}
                  onChange={setter}
                  placeholder={placeholder}
                  className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddOrUpdateEntry}
              className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition duration-200 w-full"
            >
              {editIndex !== null ? 'Update Entry' : 'Add Entry'}
            </button>
          </form>
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name..."
              className="border border-gray-300 rounded p-1 mb-4"
            />
            <button
              type="button"
              onClick={toggleShowEntries}
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200 mb-4"
            >
              {showEntries ? 'Hide Entries' : 'Show Entries'}
            </button>
            {showEntries && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 text-sm">
                  <thead>
                    <tr>
                      {['productName', 'materialCost', 'laborCost', 'overheadCost', 'waterCost', 'currentBill', 'totalCost'].map((field) => (
                        <th
                          key={field}
                          className="cursor-pointer border-b text-left p-1 text-black-300 hover:text-purple-800"
                          onClick={() => handleSort(field)}
                        >
                          {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </th>
                      ))}
                      <th className="border-b text-left p-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.length > 0 ? (
                      filteredEntries.map((entry, index) => (
                        <tr key={entry._id} className="hover:bg-gray-100">
                          <td className="border-b p-1">{entry.productName}</td>
                          <td className="border-b p-1">{entry.materialCost}</td>
                          <td className="border-b p-1">{entry.laborCost}</td>
                          <td className="border-b p-1">{entry.overheadCost}</td>
                          <td className="border-b p-1">{entry.waterCost}</td>
                          <td className="border-b p-1">{entry.currentBill}</td>
                          <td className="border-b p-1">{entry.totalCost}</td>
                          <td className="border-b p-1">
                            <button
                              className="bg-yellow-500 text-white rounded px-1 py-1 mr-2 hover:bg-yellow-600"
                              onClick={() => handleEdit(index)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 text-white rounded px-1 py-1 hover:bg-red-600"
                              onClick={() => handleDelete(index)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="border-b text-center p-4 text-gray-500">No entries found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionCostCalculator;
