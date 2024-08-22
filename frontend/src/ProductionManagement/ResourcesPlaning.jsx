import React, { useState, useEffect } from 'react';

const ResourcePlanningSystem = () => {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ id: 0, name: '', type: '', date: '', quantity: 0 });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const initialResources = [
      { id: 1, name: 'Resource A', type: 'Type 1', date: '2024-08-20', quantity: 100 },
      { id: 2, name: 'Resource B', type: 'Type 2', date: '2024-08-21', quantity: 50 },
      { id: 3, name: 'Resource C', type: 'Type 3', date: '2024-08-22', quantity: 200 },
    ];
    setResources(initialResources);
  }, []);

  const handleAddResource = () => {
    setIsAdding(true);
  };

  const handleSaveResource = () => {
    setResources([...resources, newResource]);
    setIsAdding(false);
    setNewResource({ id: 0, name: '', type: '', date: '', quantity: 0 });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewResource({ id: 0, name: '', type: '', date: '', quantity: 0 });
  };

  const handleDeleteResource = (id) => {
    setResources(resources.filter((resource) => resource.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold leading-tight text-gray-900">Resource Planning System</h1>
      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddResource}
        >
          Add Resource
        </button>
      </div>
      {isAdding && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
          <h2 className="text-lg font-bold leading-tight text-gray-900">Add New Resource</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                value={newResource.name}
                onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                Type:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="type"
                type="text"
                value={newResource.type}
                onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                Date:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="date"
                type="date"
                value={newResource.date}
                onChange={(e) => setNewResource({ ...newResource, date: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                Quantity:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="quantity"
                type="number"
                value={newResource.quantity}
                onChange={(e) => setNewResource({ ...newResource, quantity: parseInt(e.target.value, 10) })}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={handleSaveResource}
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
        <h2 className="text-lg font-bold leading-tight text-gray-900">Resources</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td className="px-4 py-2">{resource.id}</td>
                <td className="px-4 py-2">{resource.name}</td>
                <td className="px-4 py-2">{resource.type}</td>
                <td className="px-4 py-2">{resource.date}</td>
                <td className="px-4 py-2">{resource.quantity}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDeleteResource(resource.id)}
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

export default ResourcePlanningSystem;
