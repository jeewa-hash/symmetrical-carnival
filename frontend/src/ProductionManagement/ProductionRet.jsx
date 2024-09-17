import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductionRet.css';

const ProductionList = () => {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduction, setSelectedProduction] = useState(null);

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const response = await axios.get('/api/products');
        setProductions(response.data);
      } catch (err) {
        setError('Failed to fetch productions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductions();
  }, []);

  const groupByBatch = (productions) => {
    return productions.reduce((acc, production) => {
      (acc[production.batch] = acc[production.batch] || []).push(production);
      return acc;
    }, {});
  };

  const filteredProductions = productions.filter(
    (production) =>
      production.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      production._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedProductions = groupByBatch(filteredProductions);

  const handleView = (production) => {
    setSelectedProduction(production);
  };

  const handleCloseModal = () => {
    setSelectedProduction(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="production-list-container">
      <h2>Production List</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {Object.keys(groupedProductions).map((batch) => (
        <div key={batch} className="batch-section">
          <h3>Batch: {batch}</h3>
          <table className="production-list-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Production Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedProductions[batch].map((production) => (
                <tr key={production._id}>
                  <td>{production._id}</td>
                  <td>{production.name}</td>
                  <td>{production.quantity}</td>
                  <td>{production.status}</td>
                  <td>{production.productionDate}</td>
                  <td>
                    <button onClick={() => handleView(production)}>View</button>
                    <button>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {selectedProduction && (
        <div className="detail-view-modal">
          <div className="modal-content">
            <h3>Production Details</h3>
            <p><strong>ID:</strong> {selectedProduction._id}</p>
            <p><strong>Name:</strong> {selectedProduction.name}</p>
            <p><strong>Quantity:</strong> {selectedProduction.quantity}</p>
            <p><strong>Status:</strong> {selectedProduction.status}</p>
            <p><strong>Production Date:</strong> {selectedProduction.productionDate}</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionList;
