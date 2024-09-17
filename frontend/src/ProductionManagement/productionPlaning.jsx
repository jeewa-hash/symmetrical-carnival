import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './productionplaning.css';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';

// Utility function to get today's date in yyyy-MM-dd format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Component for Batch Selection
const BatchSelection = ({ selectedBatch, onBatchSelect }) => (
  <div className="batch-selection-form">
    <div className="batch-buttons">
      {['Batch 1', 'Batch 2', 'Batch 3'].map((batch) => (
        <button
          key={batch}
          className={`batch-button ${selectedBatch === batch ? 'active' : ''}`}
          onClick={() => onBatchSelect(batch)}
        >
          {batch}
        </button>
      ))}
    </div>
  </div>
);

// Component for Production Planning Form
const ProductionPlanningForm = ({
  isEditing,
  newProduction,
  products,
  onInputChange,
  onStatusChange,
  onAddProduct,
  onSubmit,
}) => (
  <div className="production-planning-form">
    <h3>{isEditing ? 'Edit Production' : 'Plan Production'}</h3>
    <form onSubmit={onSubmit}>
      {products.map((product, index) => (
        <div key={index} className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={(e) => onInputChange(e, index)}
            required
          />
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={(e) => onInputChange(e, index)}
            required
          />
          <label>Status:</label>
          <select
            name="status"
            value={product.status}
            onChange={(e) => onInputChange(e, index)}
            required
          >
            <option value="">Select Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      ))}
      <button type="button" className="add-product-button" onClick={onAddProduct}>
        Add Product
      </button>
      <div className="form-group">
        <label>Production Date:</label>
        <input
          type="date"
          name="productionDate"
          value={newProduction.productionDate}
          readOnly
          required
        />
      </div>
      <div className="form-group">
        <label>Status:</label>
        <select
          className="form-select"
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
      <button type="submit" className="submit-button">
        {isEditing ? 'Update Production' : 'Plan Production'}
      </button>
    </form>
  </div>
);

// Component for Production Table
const ProductionTable = ({ productions, onEdit, onView, onDelete }) => (
  <div className="table-container">
    <h2 className="table-title">Productions</h2>
    <table className="production-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Quantity</th>
          <th>Production Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {productions.map((production) => (
          <tr key={production.id}>
            <td>{production.id}</td>
            <td>{production.name}</td>
            <td>{production.status}</td>
            <td>{production.quantity}</td>
            <td>{production.productionDate}</td>
            <td>
              <button className="edit-button" onClick={() => onEdit(production.id)}>
                Edit
              </button>
              <button className="view-button" onClick={() => onView(production.id)}>
                View
              </button>
              <button className="delete-button" onClick={() => onDelete(production.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Component for View Production Modal
const ViewProductionModal = ({ production, onClose }) => (
  <div className="view-production-modal">
    <h2>Production Details</h2>
    <p><strong>ID:</strong> {production.id}</p>
    <p><strong>Name:</strong> {production.name}</p>
    <p><strong>Status:</strong> {production.status}</p>
    <p><strong>Quantity:</strong> {production.quantity}</p>
    <p><strong>Production Date:</strong> {production.productionDate}</p>
    <p><strong>Batch:</strong> {production.batch}</p>
    <h3>Products</h3>
    <ul>
      {production.products.map((product, index) => (
        <li key={index}>{product.name} - {product.quantity} - {product.status}</li>
      ))}
    </ul>
    <button onClick={onClose}>Close</button>
  </div>
);

const ProductionManagementSystem = () => {
  const [productions, setProductions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('Batch 1'); // Default batch
  const [newProduction, setNewProduction] = useState({
    name: '',
    quantity: '',
    productionDate: getTodayDate(), // Default date to today's date
    status: 'In Progress', // Default status
  });
  const [products, setProducts] = useState([{ name: '', quantity: '', status: '' }]); // Array of product objects
  const [isEditing, setIsEditing] = useState(false);
  const [editProductionId, setEditProductionId] = useState(null);
  const [viewProductionId, setViewProductionId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const response = await axios.get('/api/products'); // Fixed endpoint to fetch production data
        setProductions(response.data);
      } catch (error) {
        console.error('There was an error fetching the production data!', error);
      }
    };

    fetchProductions();
  }, []);

  const filteredProductions = productions.filter(
    (production) =>
      production.batch === selectedBatch &&
      (production.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        production.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
    setNewProduction((prevProduction) => ({
      ...prevProduction,
      status: e.target.value,
    }));
  };

  const handleAddProduct = () => {
    setProducts([...products, { name: '', quantity: '', status: '' }]);
  };

  const handleProductionSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting production data...');

    if (products.length > 0) {
      try {
        const productionData = {
          name: products.map(p => p.name).join(', '),
          quantity: products.reduce((acc, p) => acc + Number(p.quantity), 0),
          productionDate: getTodayDate(),
          status: newProduction.status,
          batch: selectedBatch,
          products,
        };

        console.log('Production Data:', productionData);

        if (isEditing) {
          await axios.put(`/api/products/${editProductionId}`, productionData);
          setProductions(prevProductions =>
            prevProductions.map(prod =>
              prod.id === editProductionId
                ? { ...prod, ...productionData }
                : prod
            )
          );
        } else {
          const response = await axios.post('/api/products', productionData);
          setProductions([...productions, response.data]);
        }

        setSuccessMessage('Production successfully planned!');
        // Clear the form
        setNewProduction({
          name: '',
          quantity: '',
          productionDate: getTodayDate(),
          status: 'In Progress',
        });
        setProducts([{ name: '', quantity: '', status: '' }]);
        setIsEditing(false);
        setEditProductionId(null);
      } catch (error) {
        console.error('Error submitting production data:', error);
      }
    } else {
      alert('Please add at least one product.');
    }
  };

  const handleEdit = (id) => {
    const productionToEdit = productions.find((prod) => prod.id === id);
    setNewProduction({
      name: productionToEdit.name,
      quantity: productionToEdit.quantity,
      productionDate: productionToEdit.productionDate,
      status: productionToEdit.status,
    });
    setProducts(productionToEdit.products);
    setIsEditing(true);
    setEditProductionId(id);
  };

  const handleView = (id) => {
    setViewProductionId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setProductions(productions.filter((prod) => prod.id !== id));
    } catch (error) {
      console.error('Error deleting production:', error);
    }
  };

  const handleCloseModal = () => {
    setViewProductionId(null);
  };

  return (
    <div>
      <Header />
      <div className="production-management-container">
        <BatchSelection selectedBatch={selectedBatch} onBatchSelect={handleBatchSelect} />
        <ProductionPlanningForm
          isEditing={isEditing}
          newProduction={newProduction}
          products={products}
          onInputChange={handleInputChange}
          onStatusChange={handleStatusChange}
          onAddProduct={handleAddProduct}
          onSubmit={handleProductionSubmit}
        />
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ProductionTable
          productions={filteredProductions}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
        {viewProductionId && (
          <ViewProductionModal
            production={productions.find((prod) => prod.id === viewProductionId)}
            onClose={handleCloseModal}
          />
        )}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
      <Footer />
    </div>
  );
};

export default ProductionManagementSystem;
