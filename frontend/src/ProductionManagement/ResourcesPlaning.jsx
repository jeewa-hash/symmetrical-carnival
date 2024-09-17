import React, { useState, useEffect } from 'react';
import './ResourcesPlaning.css';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';

const ResourcePlanningSystem = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [newResources, setNewResources] = useState([{ id: 0, name: '', date: '', quantity: 0 }]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const initialResources = [
      { id: 1, name: 'Resource A', date: '2024-08-20', quantity: 100 },
      { id: 2, name: 'Resource B', date: '2024-08-21', quantity: 50 },
      { id: 3, name: 'Resource C', date: '2024-08-20', quantity: 200 },
    ];
    setResources(initialResources);
    setFilteredResources(initialResources);
  }, []);

  useEffect(() => {
    const filtered = resources.filter(
      (resource) =>
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.date.includes(searchQuery)
    );
    setFilteredResources(filtered);
  }, [searchQuery, resources]);

  const handleAddResource = () => {
    setIsAdding(true);
    setNewResources([{ id: 0, name: '', date: new Date().toISOString().slice(0, 10), quantity: 0 }]);
  };

  const handleSaveResources = () => {
    const newId = resources.length ? Math.max(...resources.map(r => r.id)) + 1 : 1;
    const resourcesWithId = newResources.map((resource, index) => ({
      ...resource,
      id: newId + index
    }));
    setResources([...resources, ...resourcesWithId]);
    setFilteredResources([...resources, ...resourcesWithId]);
    setIsAdding(false);
    setNewResources([{ id: 0, name: '', date: '', quantity: 0 }]);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewResources([{ id: 0, name: '', date: '', quantity: 0 }]);
  };

  const handleDeleteResource = (id) => {
    setResources(resources.filter((resource) => resource.id !== id));
    setFilteredResources(filteredResources.filter((resource) => resource.id !== id));
  };

  const handleResourceChange = (index, field, value) => {
    const updatedResources = [...newResources];
    updatedResources[index] = { ...updatedResources[index], [field]: value };
    setNewResources(updatedResources);
  };

  const handleAddResourceField = () => {
    setNewResources([...newResources, { id: 0, name: '', date: new Date().toISOString().slice(0, 10), quantity: 0 }]);
  };

  const groupResourcesByDate = () => {
    return filteredResources.reduce((acc, resource) => {
      if (!acc[resource.date]) {
        acc[resource.date] = [];
      }
      acc[resource.date].push(resource);
      return acc;
    }, {});
  };

  const groupedResources = groupResourcesByDate();

  return (
    <div>
      <Header />
      <div className="container">
        <h1 className="title">Resource Planning System</h1>
        <div className="button-container">
          <button className="btn btn-primary" onClick={handleAddResource}>
            Add Resources
          </button>
        </div>
        {isAdding && (
          <div className="form-container">
            <h2 className="form-title">Add New Resources</h2>
            <form>
              {newResources.map((resource, index) => (
                <div key={index} className="resource-form-group">
                  <div className="form-group">
                    <label htmlFor={`name-${index}`}>Item Name:</label>
                    <input
                      id={`name-${index}`}
                      type="text"
                      value={resource.name}
                      onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`date-${index}`}>Date:</label>
                    <input
                      id={`date-${index}`}
                      type="date"
                      value={resource.date}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`quantity-${index}`}>Quantity:</label>
                    <input
                      id={`quantity-${index}`}
                      type="number"
                      value={resource.quantity}
                      onChange={(e) => handleResourceChange(index, 'quantity', parseInt(e.target.value, 10))}
                    />
                  </div>
                </div>
              ))}
              <div className="form-actions">
                <button className="btn btn-primary" type="button" onClick={handleSaveResources}>
                  Save
                </button>
                <button className="btn btn-secondary" type="button" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn btn-secondary" type="button" onClick={handleAddResourceField}>
                  Add Another Resource
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="table-container">
          <h2 className="table-title">Resources</h2>
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              placeholder="Search by name or date"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {Object.keys(groupedResources).map((date) => (
            <div key={date}>
              <h3>{date}</h3>
              <table className="resource-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedResources[date].map((resource) => (
                    <tr key={resource.id}>
                      <td>{resource.id}</td>
                      <td>{resource.name}</td>
                      <td>{resource.quantity}</td>
                      <td>
                        <button className="btn btn-danger" onClick={() => handleDeleteResource(resource.id)}>
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
      </div>
      <Footer />
    </div>
  );
};

export default ResourcePlanningSystem;
