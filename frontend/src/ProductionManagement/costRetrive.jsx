import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ProductionCostCalculator = () => {
  const [productName, setProductName] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [overheadCost, setOverheadCost] = useState('');
  const [waterCost, setWaterCost] = useState('');
  const [currentBill, setCurrentBill] = useState('');
  const [entries, setEntries] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    shopName: '',
    orderDate: '',
    status: '',
    orderItems: []
  });
  const [newItem, setNewItem] = useState({ name: '', quantity: 1 });

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('/api/production-costs');
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };
    fetchEntries();
  }, []);

  const isPositiveNumber = (value) => /^\d+(\.\d{1,2})?$/.test(value) && Number(value) >= 0;

  const validateForm = () => {
    if (!productName.trim()) return 'Product Name is required.';
    if (!isPositiveNumber(materialCost)) return 'Material Cost must be a positive number.';
    if (!isPositiveNumber(laborCost)) return 'Labor Cost must be a positive number.';
    if (!isPositiveNumber(overheadCost)) return 'Overhead Cost must be a positive number.';
    if (!isPositiveNumber(waterCost)) return 'Water Cost must be a positive number.';
    if (!isPositiveNumber(currentBill)) return 'Current Bill must be a positive number.';
    return '';
  };

  const calculateTotalCost = () => (
    [
      Number(materialCost) || 0,
      Number(laborCost) || 0,
      Number(overheadCost) || 0,
      Number(waterCost) || 0,
      Number(currentBill) || 0
    ].reduce((acc, cost) => acc + cost, 0).toFixed(2)
  );

  const resetForm = () => {
    setProductName('');
    setMaterialCost('');
    setLaborCost('');
    setOverheadCost('');
    setWaterCost('');
    setCurrentBill('');
  };

  const handleAddOrUpdateEntry = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(''); // Clear error message if validation passes

    const newEntry = {
      productName,
      materialCost: Number(materialCost),
      laborCost: Number(laborCost),
      overheadCost: Number(overheadCost),
      waterCost: Number(waterCost),
      currentBill: Number(currentBill),
      totalCost: calculateTotalCost(),
    };

    try {
      if (editIndex !== null) {
        await axios.put(`/api/production-costs/${entries[editIndex]._id}`, newEntry);
        const updatedEntries = entries.map((entry, index) =>
          index === editIndex ? newEntry : entry
        );
        setEntries(updatedEntries);
        setEditIndex(null);
      } else {
        const response = await axios.post('/api/production-costs', newEntry);
        setEntries([...entries, response.data]);
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      setError('An error occurred while saving the entry.');
    }

    resetForm();
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
    try {
      await axios.delete(`/api/production-costs/${entries[index]._id}`);
      const updatedEntries = entries.filter((_, i) => i !== index);
      setEntries(updatedEntries);
      if (editIndex === index) {
        resetForm();
        setEditIndex(null);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError('An error occurred while deleting the entry.');
    }
  };

  const handleView = (entry) => {
    alert(`
      Product Name: ${entry.productName}
      Material Cost: RS ${entry.materialCost}
      Labor Cost: RS ${entry.laborCost}
      Overhead Cost: RS ${entry.overheadCost}
      Water Cost: RS ${entry.waterCost}
      Current Bill: RS ${entry.currentBill}
      Total Cost: RS ${entry.totalCost}
    `);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditItemChange = (index, e) => {
    const { name, value } = e.target;
    const newOrderItems = [...editFormData.orderItems];
    newOrderItems[index] = { ...newOrderItems[index], [name]: value };
    setEditFormData((prevData) => ({ ...prevData, orderItems: newOrderItems }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Handle submit logic
    setIsEditModalOpen(false); // Close modal after submission
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Production Cost Calculator</h1>
        <form className="flex flex-col gap-6 mb-6">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {[ 
            { id: 'productName', label: 'Product Name:', type: 'text', value: productName, setter: setProductName, placeholder: 'Enter product name' },
            { id: 'materialCost', label: 'Material Cost (RS):', type: 'number', value: materialCost, setter: setMaterialCost, placeholder: 'Enter material cost' },
            { id: 'laborCost', label: 'Labor Cost (RS):', type: 'number', value: laborCost, setter: setLaborCost, placeholder: 'Enter labor cost' },
            { id: 'overheadCost', label: 'Overhead Cost (RS):', type: 'number', value: overheadCost, setter: setOverheadCost, placeholder: 'Enter overhead cost' },
            { id: 'waterCost', label: 'Water Cost (RS):', type: 'number', value: waterCost, setter: setWaterCost, placeholder: 'Enter water cost' },
            { id: 'currentBill', label: 'Current Bill (RS):', type: 'number', value: currentBill, setter: setCurrentBill, placeholder: 'Enter current bill' }
          ].map(({ id, label, type, value, setter, placeholder }) => (
            <div key={id} className="flex flex-col gap-3">
              <label className="text-lg font-medium" htmlFor={id}>{label}</label>
              <input
                type={type}
                id={id}
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="p-3 border border-gray-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder={placeholder}
                min="0"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOrUpdateEntry}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-200"
          >
            {editIndex !== null ? 'Update Entry' : 'Add Entry'}
          </button>
        </form>

        <div className="mt-6">
          <h2 className="text-3xl font-bold mb-4 text-center">Cost Review</h2>
          <table className="min-w-full bg-white rounded-md shadow-md overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Material Cost (RS)</th>
                <th className="p-3 text-left">Labor Cost (RS)</th>
                <th className="p-3 text-left">Overhead Cost (RS)</th>
                <th className="p-3 text-left">Water Cost (RS)</th>
                <th className="p-3 text-left">Current Bill (RS)</th>
                <th className="p-3 text-left">Total Cost (RS)</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry._id}>
                  <td className="p-3 border-b">{entry.productName}</td>
                  <td className="p-3 border-b">{entry.materialCost}</td>
                  <td className="p-3 border-b">{entry.laborCost}</td>
                  <td className="p-3 border-b">{entry.overheadCost}</td>
                  <td className="p-3 border-b">{entry.waterCost}</td>
                  <td className="p-3 border-b">{entry.currentBill}</td>
                  <td className="p-3 border-b">{entry.totalCost}</td>
                  <td className="p-3 border-b">
                    <button onClick={() => { handleEdit(index); setIsEditModalOpen(true); }} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md">Edit</button>
                    <button onClick={() => handleDelete(index)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md">Delete</button>
                    <button onClick={() => handleView(entry)} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Order</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              {/* Edit Order Details */}
              <div>
                <label className="text-lg font-medium" htmlFor="shopName">Shop Name:</label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={editFormData.shopName}
                  onChange={handleEditChange}
                  className="p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="text-lg font-medium" htmlFor="orderDate">Order Date:</label>
                <input
                  type="date"
                  id="orderDate"
                  name="orderDate"
                  value={editFormData.orderDate}
                  onChange={handleEditChange}
                  className="p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="text-lg font-medium" htmlFor="status">Status:</label>
                <select
                  id="status"
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditChange}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select status</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              {/* Order Items */}
              <div>
                <label className="text-lg font-medium">Order Items:</label>
                {editFormData.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleEditItemChange(index, e)}
                      className="p-2 border border-gray-300 rounded-md w-1/2"
                      placeholder="Item Name"
                      required
                    />
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleEditItemChange(index, e)}
                      className="p-2 border border-gray-300 rounded-md w-1/4 ml-2"
                      placeholder="Quantity"
                      min="1"
                      required
                    />
                  </div>
                ))}
                <div className="flex mt-2">
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="p-2 border border-gray-300 rounded-md w-1/2"
                    placeholder="New Item Name"
                  />
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="p-2 border border-gray-300 rounded-md w-1/4 ml-2"
                    placeholder="Quantity"
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditFormData((prevData) => ({
                        ...prevData,
                        orderItems: [...prevData.orderItems, newItem]
                      }));
                      setNewItem({ name: '', quantity: 1 });
                    }}
                    className="bg-blue-500 text-white p-2 rounded-md ml-2"
                  >
                    Add Item
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md mt-4"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md mt-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      
     
    </div>
  );
};

export default ProductionCostCalculator;
