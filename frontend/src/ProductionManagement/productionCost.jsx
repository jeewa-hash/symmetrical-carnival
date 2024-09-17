import React, { useState } from 'react';

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

  const isPositiveNumber = (value) => {
    return /^\d+(\.\d{1,2})?$/.test(value) && Number(value) >= 0;
  };

  const validateForm = () => {
    if (!productName.trim()) {
      return 'Product Name is required.';
    }
    if (!isPositiveNumber(materialCost)) {
      return 'Material Cost must be a positive number.';
    }
    if (!isPositiveNumber(laborCost)) {
      return 'Labor Cost must be a positive number.';
    }
    if (!isPositiveNumber(overheadCost)) {
      return 'Overhead Cost must be a positive number.';
    }
    if (!isPositiveNumber(waterCost)) {
      return 'Water Cost must be a positive number.';
    }
    if (!isPositiveNumber(currentBill)) {
      return 'Current Bill must be a positive number.';
    }
    return '';
  };

  const calculateTotalCost = () => {
    const material = isPositiveNumber(materialCost) ? Number(materialCost) : 0;
    const labor = isPositiveNumber(laborCost) ? Number(laborCost) : 0;
    const overhead = isPositiveNumber(overheadCost) ? Number(overheadCost) : 0;
    const water = isPositiveNumber(waterCost) ? Number(waterCost) : 0;
    const current = isPositiveNumber(currentBill) ? Number(currentBill) : 0;
    return material + labor + overhead + water + current;
  };

  const handleAddOrUpdateEntry = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(''); // Clear error message if validation passes

    const newEntry = {
      productName,
      materialCost,
      laborCost,
      overheadCost,
      waterCost,
      currentBill,
      totalCost: calculateTotalCost().toFixed(2),
    };

    if (editIndex !== null) {
      const updatedEntries = entries.map((entry, index) =>
        index === editIndex ? newEntry : entry
      );
      setEntries(updatedEntries);
      setEditIndex(null);
    } else {
      setEntries([...entries, newEntry]);
    }

    resetForm();
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

  const handleDelete = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    if (editIndex === index) {
      resetForm();
      setEditIndex(null);
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-6">Production Cost Calculator</h1>
      <form className="flex flex-col gap-6 mb-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {/* Form Inputs */}
        {[ 
          { id: 'productName', label: 'Product Name:', type: 'text', value: productName, setter: setProductName, placeholder: 'Enter product name' },
          { id: 'materialCost', label: 'Material Cost (RS):', type: 'number', value: materialCost, setter: setMaterialCost, placeholder: 'Enter material cost' },
          { id: 'laborCost', label: 'Labor Cost (RS):', type: 'number', value: laborCost, setter: setLaborCost, placeholder: 'Enter labor cost' },
          { id: 'overheadCost', label: 'Overhead Cost (RS):', type: 'number', value: overheadCost, setter: setOverheadCost, placeholder: 'Enter overhead cost' },
          { id: 'waterCost', label: 'Water Cost (RS):', type: 'number', value: waterCost, setter: setWaterCost, placeholder: 'Enter water cost' },
          { id: 'currentBill', label: 'Current Bill (RS):', type: 'number', value: currentBill, setter: setCurrentBill, placeholder: 'Enter current bill' }
        ].map(({ id, label, type, value, setter, placeholder }) => (
          <div key={id} className="flex flex-col gap-3">
            <label className="text-xl font-medium" htmlFor={id}>{label}</label>
            <input
              type={type}
              id={id}
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="p-3 border border-gray-300 rounded-md text-lg"
              placeholder={placeholder}
              min="0"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddOrUpdateEntry}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md"
        >
          {editIndex !== null ? 'Update Entry' : 'Add Entry'}
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Cost Review</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
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
              <tr key={index} className="border-b border-gray-300">
                <td className="p-3">{entry.productName || 'N/A'}</td>
                <td className="p-3">RS {entry.materialCost || '0.00'}</td>
                <td className="p-3">RS {entry.laborCost || '0.00'}</td>
                <td className="p-3">RS {entry.overheadCost || '0.00'}</td>
                <td className="p-3">RS {entry.waterCost || '0.00'}</td>
                <td className="p-3">RS {entry.currentBill || '0.00'}</td>
                <td className="p-3">RS {entry.totalCost}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleView(entry)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded-md"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionCostCalculator;
