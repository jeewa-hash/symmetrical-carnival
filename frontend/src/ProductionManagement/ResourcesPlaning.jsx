import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import your background image
import backgroundImage from '../image/design.png'; // Adjust the path according to your folder structure

const ResourcePlanningSystem = () => {
  const [newResources, setNewResources] = useState([{ id: 0, name: '', date: '', quantity: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Sample resource names for the dropdown
  const resourceNames = ['Wool', 'XL Eyes', 'L Eyes', 'Red Fabric'];

  // Function to get today's date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  // Set the default date when the component mounts
  useEffect(() => {
    setNewResources([{ id: 0, name: '', date: getCurrentDate(), quantity: 0 }]); // Initialize with today's date
  }, []); // Empty dependency array ensures this runs only once

  const handleSaveResources = async () => {
    if (!Array.isArray(newResources) || newResources.length === 0 || newResources.some(r => !r.name || r.quantity <= 0)) {
      setError('Please fill all fields correctly.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post('/api/resource', newResources);
      // Reset with today's date only when saving
      setNewResources([{ id: 0, name: '', date: getCurrentDate(), quantity: 0 }]);
    } catch (error) {
      console.error(error);
      setError('Error saving resources');
    } finally {
      setLoading(false);
    }
  };

  const handleResourceChange = (index, field, value) => {
    const updatedResources = [...newResources];

    // Validate quantity to be a positive integer
    if (field === 'quantity') {
      const isValidQuantity = /^[1-9]\d*$/.test(value) || value === ''; // Allow only positive integers or empty
      if (!isValidQuantity) {
        return; // Exit if the value is invalid
      }
    }

    updatedResources[index] = { ...updatedResources[index], [field]: value };
    setNewResources(updatedResources);
  };

  const handleAddResourceField = () => {
    // Set the date to today's date when adding a new resource
    setNewResources([...newResources, { id: 0, name: '', date: getCurrentDate(), quantity: 0 }]);
  };

  const handleCancel = () => {
    // Reset form
    setNewResources([{ id: 0, name: '', date: getCurrentDate(), quantity: 0 }]);
    setError(''); // Clear any error messages
  };

  const handleViewResources = () => {
    navigate('/resourcetret'); // Navigate to the resource retrieve page (Resourcetret)
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="flex-1 flex justify-center items-center z-10"> {/* Set z-index for content */}
        <div className="max-w-xl w-full bg-pink-100 rounded-lg shadow-xl p-10 border border-gray-200 space-y-6">
          <h1 className="text-4xl font-bold text-purple-600 mb-4 text-center">Resource Planning System</h1>
          {error && <div className="mb-4 text-red-600">{error}</div>}
          <form>
            {newResources.map((resource, index) => (
              <div key={index} className="space-y-4">
                <div>
                  <label className="block text-lg font-semibold text-gray-700" htmlFor={`name-${index}`}>Item Name:</label>
                  <select
                    id={`name-${index}`}
                    className="mt-1 block w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={resource.name}
                    onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                  >
                    <option value="">Select Resource</option>
                    {resourceNames.map((name, idx) => (
                      <option key={idx} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700" htmlFor={`date-${index}`}>Date:</label>
                  <input
                    id={`date-${index}`}
                    type="date"
                    value={resource.date} // Set the date input value
                    readOnly // Make the date field read-only
                    className="mt-1 block w-full h-10 border border-gray-300 p-1 bg-gray-100 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700" htmlFor={`quantity-${index}`}>Quantity:</label>
                  <input
                    id={`quantity-${index}`}
                    type="number"
                    value={resource.quantity}
                    onChange={(e) => handleResourceChange(index, 'quantity', e.target.value)} // Pass the string value to validate
                    onKeyDown={(e) => {
                      // Allow only numbers (0-9) and control keys (Backspace, Delete, Arrow keys)
                      if (!/^[0-9]$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                        e.preventDefault(); // Prevent the default action for invalid keys
                      }
                    }}
                    className="mt-1 block w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            ))}
            {/* Add margin-top to the button container for increased gap */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200"
                onClick={handleAddResourceField}
              >
                Add Another Resource
              </button>
              <button
                type="button"
                className="bg-gray-300 text-black rounded-lg px-4 py-2 hover:bg-gray-400 transition duration-200"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition duration-200"
                onClick={handleSaveResources}
                disabled={loading}
              >
                Save
              </button>
            </div>
          </form>

          {/* View Resources button moved outside the form */}
          <button
            className="mt-4 w-full bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition duration-200"
            onClick={handleViewResources}
          >
            View Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourcePlanningSystem;
