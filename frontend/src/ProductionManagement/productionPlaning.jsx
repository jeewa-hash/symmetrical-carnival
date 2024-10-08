import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const productNames = ['Bear', 'Bear With Heart', 'Dog', '5 Feet', 'Dalmation'];

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
  const [isSlideViewOpen, setIsSlideViewOpen] = useState(false);
  const [formData, setFormData] = useState([]);
  const [groupedRequests, setGroupedRequests] = useState({});
  const [checkedOrders, setCheckedOrders] = useState([]); // State for checked items

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/productionRequest');
        setFormData(response.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const groupRequests = () => {
      const grouped = formData.reduce((acc, request) => {
        const date = new Date(request.date).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(request);
        return acc;
      }, {});

      setGroupedRequests(grouped);
    };
    groupRequests();
  }, [formData]);

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
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
      resetForm();
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
    navigate('/productret');
  };

  const handleSlideView = () => {
    setIsSlideViewOpen(!isSlideViewOpen);
  };

  const handleCheckboxChange = (id) => {
    setCheckedOrders((prevChecked) =>
      prevChecked.includes(id) ? prevChecked.filter((item) => item !== id) : [...prevChecked, id]
    );
  };
  
  const separateAndCombineOrders = (filteredOrders, checkedOrders) => {
    const uncheckedOrders = filteredOrders.filter((order) => !checkedOrders.includes(order._id));
    const checkedOrdersList = filteredOrders.filter((order) => checkedOrders.includes(order._id));
    
    return [...uncheckedOrders, ...checkedOrdersList];
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-3xl p-10 bg-pink-100 rounded-lg shadow-xl">
          <h1 className="text-4xl font-bold text-purple-600 text-center mb-6 -mt8">Production Management System</h1>
          <BatchSelection selectedBatch={selectedBatch} onBatchSelect={handleBatchSelect} />
          <ProductionPlanningForm
            isEditing={isEditing}
            newProduction={newProduction}
            products={products}
            onInputChange={handleInputChange}
            onStatusChange={handleStatusChange}
            onSubmit={handleProductionSubmit}
          />
          <div className="flex justify-between mt-6">
            <button
              onClick={handleViewProductions}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              View Productions
            </button>
            <button
              onClick={handleSlideView}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              View Orders
            </button>
          </div>
          {successMessage && <div className="mt-4 text-green-600">{successMessage}</div>}
        </div>
      </div>

      {/* Slide-in View */}
<div
  className={`fixed inset-y-0 right-0 w-80 bg-gradient-to-b from-pink-200 to-rose-400 text-rose-900 transition-transform duration-300 transform ${isSlideViewOpen ? 'translate-x-0' : 'translate-x-full'}`}
>
  <div className="p-4">
    <h2 className="text-2xl font-bold">Orders</h2>
    <ul className="mt-2 space-y-2">
      {/* Separate and combine orders */}
      {Object.keys(groupedRequests).map((date) => {
        const filteredOrders = groupedRequests[date]; // Get the orders for the specific date
        const combinedOrders = separateAndCombineOrders(filteredOrders, checkedOrders);
        
        // Separate checked and unchecked orders
        const uncheckedOrders = combinedOrders.filter((order) => !checkedOrders.includes(order._id));
        const checkedOrdersList = combinedOrders.filter((order) => checkedOrders.includes(order._id));

        return (
          <li key={date} className="border-b py-2">
            <h3 className="font-semibold">{date}</h3>
            <ul>
              {/* Render unchecked orders first */}
              {uncheckedOrders.map((request) => (
                <li key={request._id} className={`text-sm`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checkedOrders.includes(request._id)}
                      onChange={() => handleCheckboxChange(request._id)}
                      className="mr-2"
                    />
                    {request.productName}: {request.quantity} pcs
                  </label>
                </li>
              ))}

              {/* Render checked orders at the bottom */}
              {checkedOrdersList.map((request) => (
                <li key={request._id} className={`text-sm blur-sm opacity-50`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checkedOrders.includes(request._id)}
                      onChange={() => handleCheckboxChange(request._id)}
                      className="mr-2"
                    />
                    {request.productName}: {request.quantity} pcs
                  </label>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  </div>
</div>

    </div>
  );
};

export default ProductionManagementSystem;
