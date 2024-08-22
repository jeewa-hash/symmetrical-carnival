import React, { useState, useEffect } from 'react';

const ProductionManagementSystem = () => {
  const [productions, setProductions] = useState([]);
  const [newProduction, setNewProduction] = useState({ id: 0, name: '', status: '', quantity: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');

  useEffect(() => {
    const initialProductions = [
      { id: 1, name: 'Product A', status: 'In Progress', quantity: 100 },
      { id: 2, name: 'Product B', status: 'Done', quantity: 50 },
      { id: 3, name: 'Product C', status: 'On Hold', quantity: 200 },
    ];
    setProductions(initialProductions);
  }, []);

  const handleAddProduction = () => {
    setIsAdding(true);
  };

  const handleSaveProduction = () => {
    setProductions([...productions, newProduction]);
    setIsAdding(false);
    setNewProduction({ id: 0, name: '', status: '', quantity: 0 });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewProduction({ id: 0, name: '', status: '', quantity: 0 });
  };

  const handleDeleteProduction = (id) => {
    setProductions(productions.filter((production) => production.id !== id));
  };

  const handleEditStatus = (id, currentStatus) => {
    setEditingId(id);
    setUpdatedStatus(currentStatus);
  };

  const handleSaveStatus = (id) => {
    setProductions(
      productions.map((production) =>
        production.id === id ? { ...production, status: updatedStatus } : production
      )
    );
    setEditingId(null);
    setUpdatedStatus('');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold leading-tight text-gray-900">Production Management System</h1>
      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddProduction}
        >
          Add Production
        </button>
      </div>
      {isAdding && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
          <h2 className="text-lg font-bold leading-tight text-gray-900">Add New Production</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                value={newProduction.name}
                onChange={(e) => setNewProduction({ ...newProduction, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status:
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="status"
                value={newProduction.status}
                onChange={(e) => setNewProduction({ ...newProduction, status: e.target.value })}
              >
                <option value="">Select Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                Quantity:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="quantity"
                type="number"
                value={newProduction.quantity}
                onChange={(e) => setNewProduction({ ...newProduction, quantity: parseInt(e.target.value, 10) })}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={handleSaveProduction}
              >
                Save
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-lg font-bold leading-tight text-gray-900">Productions</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productions.map((production) => (
              <tr key={production.id}>
                <td className="px-4 py-2">{production.id}</td>
                <td className="px-4 py-2">{production.name}</td>
                <td className="px-4 py-2">
                  {editingId === production.id ? (
                    <div>
                      <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={updatedStatus}
                        onChange={(e) => setUpdatedStatus(e.target.value)}
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                        onClick={() => handleSaveStatus(production.id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2 mt-2"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    production.status
                  )}
                </td>
                <td className="px-4 py-2">{production.quantity}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDeleteProduction(production.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => handleEditStatus(production.id, production.status)}
                  >
                    Edit Status
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

export default ProductionManagementSystem;
