import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd'; // Only importing message from antd
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../image/design.png'; // Adjust the path according to your folder structure

// Utility function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Batch selection component
const BatchSelection = ({ selectedBatch, onBatchSelect }) => (
  <div className="mb-6">
    <div className="flex space-x-4 justify-center">
      {['Filling', 'Cutting', 'Production'].map((batch) => (
        <button
          key={batch}
          onClick={() => onBatchSelect(batch)}
          className={`px-4 py-2 rounded-lg text-white ${selectedBatch === batch ? 'bg-rose-500' : 'bg-gray-400 hover:bg-gray-500'}`}
        >
          {batch}
        </button>
      ))}
    </div>
  </div>
);

// Production planning form component
const ProductionPlanningForm = ({ isEditing, newProduction, products, onInputChange, onStatusChange, onSubmit }) => {
  const productNames = ['Bear', 'Bear With Heart', 'Dog', '5 Feet', 'Dalmation', 'Teddy', 'Doll'];

  return (
    <div className="max-w-xl mx-auto p-10 bg-pink-100 border border-gray-200 rounded-lg shadow-xl space-y-6">
      <form onSubmit={onSubmit}>
        {products.map((product, index) => (
          <div key={index} className="mb-4">
            <label className="block text-lg font-semibold text-gray-700">Product Name:</label>
            <select
              name="name"
              value={product.name}
              onChange={(e) => onInputChange(e, index)}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Product</option>
              {productNames.map((productName) => (
                <option key={productName} value={productName}>
                  {productName}
                </option>
              ))}
            </select>
            <label className="block text-lg font-semibold text-gray-700 mt-2">Quantity:</label>
            <input
              type="text"
              name="quantity"
              value={product.quantity}
              onChange={(e) => onInputChange(e, index)}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700">Production Date:</label>
          <input
            type="date"
            name="productionDate"
            value={newProduction.productionDate}
            readOnly
            className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700">Status:</label>
          <select
            className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            name="status"
            value={newProduction.status}
            onChange={onStatusChange}
            required
          >
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
          {isEditing ? 'Update Production' : 'Plan Production'}
        </button>
      </form>
    </div>
  );
};

// Main production management system component
const ProductionManagementSystem = () => {
  const [productions, setProductions] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('Filling');
  const [newProduction, setNewProduction] = useState({
    name: '',
    quantity: '',
    productionDate: getTodayDate(),
    status: 'In Progress',
  });
  const [products, setProducts] = useState([{ name: '', quantity: '' }]);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for slide-out sidebar
  const [loading, setLoading] = useState(false); // Loading state
  const [formData, setFormData] = useState([]); // State for production request data

  const navigate = useNavigate(); // Using navigate function from react-router-dom

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const response = await axios.get('/api/products');
        const filteredProductions = response.data.filter(
          (production) => production.batch === selectedBatch
        );
        setProductions(filteredProductions);
      } catch (error) {
        console.error('Error fetching production data!', error);
      }
    };

    fetchProductions();
  }, [selectedBatch]);

  // Fetch production requests
  useEffect(() => {
    const fetchProductionRequests = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.get('http://localhost:4000/api/productionRequest');
        setFormData(response.data);
      } catch (error) {
        message.error('Failed to fetch data');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (isSidebarOpen) {
      fetchProductionRequests(); // Fetch requests when the sidebar is opened
    }
  }, [isSidebarOpen]);

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      const isValidQuantity = /^[1-9][0-9]*$/.test(value) || value === '';
      if (!isValidQuantity) {
        return;
      }
    }
    const updatedProducts = [...products];
    updatedProducts[index][name] = value;
    setProducts(updatedProducts);
  };

  const handleStatusChange = (e) => {
    setNewProduction((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleProductionSubmit = async (e) => {
    e.preventDefault();
    if (products.length > 0) {
      try {
        const productionData = {
          name: products.map((p) => p.name).join(', '),
          quantity: products.reduce((acc, p) => acc + Number(p.quantity), 0),
          productionDate: getTodayDate(),
          status: newProduction.status,
          batch: selectedBatch,
          products,
        };

        if (isEditing) {
          await axios.put(`/api/products/${newProduction.id}`, productionData);
        } else {
          await axios.post('/api/products', productionData);
        }

        setSuccessMessage('Production planned successfully!');
        resetForm();
      } catch (error) {
        console.error('Error submitting production data!', error);
      }
    } else {
      setSuccessMessage('Please add at least one product to the production plan.');
    }
  };

  const resetForm = () => {
    setNewProduction({ name: '', quantity: '', productionDate: getTodayDate(), status: 'In Progress' });
    setProducts([{ name: '', quantity: '' }]);
    setIsEditing(false);
  };

  const handleViewProductions = () => {
    navigate('/productret'); // Navigate to the /productret page
  };

  // New function to handle slide-out sidebar
  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSelectRequest = (request) => {
    // Auto-fill the fields with the selected request data
    setProducts([{ name: request.productName, quantity: request.quantity }]);
    // Note: Do not close the sidebar
  };

  return (
    <div>
      <div className="relative h-screen flex items-center justify-center" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
          <h1 className="text-3xl font-bold text-purple-600 mb-4 text-center">Production Management System</h1>
          <BatchSelection selectedBatch={selectedBatch} onBatchSelect={handleBatchSelect} />
          <ProductionPlanningForm
            isEditing={isEditing}
            newProduction={newProduction}
            products={products}
            onInputChange={handleInputChange}
            onStatusChange={handleStatusChange}
            onSubmit={handleProductionSubmit}
          />
          <button
            onClick={handleViewProductions}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            View Production List
          </button>
          <button
            onClick={handleSidebarToggle}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Production Requests
          </button>
          {successMessage && <div className="mt-4 text-green-500">{successMessage}</div>}
        </div>
      </div>

     {/* Slide view for production requests */}
{isSidebarOpen && (
  <div className="fixed inset-0 flex justify-end z-50">
    <div className="bg-gradient-to-t from-pink-200 to-rose-300 text-rose-700 w-96 h-full shadow-lg p-6 transition-transform transform translate-x-0 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-5 border-b-2 border-rose-700 pb-2">🧸 Production Request</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="max-h-80 overflow-y-auto"> {/* Add max height and scrolling */}
          {formData.map((request) => (
            <li key={request.id} className="flex items-center p-2 border-b hover:bg-gray-100">
              <input
                type="checkbox"
                className="mr-2"
                onChange={(e) => {
                  if (e.target.checked) {
                    handleSelectRequest(request); // Auto-fill when checkbox is checked
                  }
                }}
              />
              <span>{request.productName}</span>
              <span className="ml-auto">{request.quantity}</span>
            </li>
          ))}
        </ul>
      )}
  


            <button
              onClick={handleSidebarToggle}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionManagementSystem;
