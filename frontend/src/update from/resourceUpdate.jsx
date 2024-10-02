import React from 'react'
import axios from 'axios';

const ResourcePlanningSystem = () => {
    const [newResources, setNewResources] = useState([{ id: 0, name: '', date: new Date().toISOString().slice(0, 10), quantity: 0 }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    // Sample resource names for the dropdown
    const resourceNames = ['Wool', 'XL Eyes', 'L Eyes', 'Red Fabric'];
  
    const handleSaveResources = async () => {
      if (!Array.isArray(newResources) || newResources.length === 0 || newResources.some(r => !r.name || r.quantity <= 0)) {
        setError('Please fill all fields correctly.');
        return;
      }
  
      setLoading(true);
      setError('');
      try {
        await axios.post('/api/resource', newResources);
        setNewResources([{ id: 0, name: '', date: new Date().toISOString().slice(0, 10), quantity: 0 }]); // Reset with current date
      } catch (error) {
        console.error(error);
        setError('Error saving resources');
      } finally {
        setLoading(false);
      }
    };
  
    const handleResourceChange = (index, field, value) => {
      const updatedResources = [...newResources];
  
      // Validate quantity if the field being changed is quantity
      if (field === 'quantity') {
        const isValidQuantity = /^[1-9]\d*$/.test(value) || value === ''; // Allow only positive integers
        if (!isValidQuantity) {
          return; // Exit if the value is invalid
        }
      }
  
      updatedResources[index] = { ...updatedResources[index], [field]: value };
      setNewResources(updatedResources);
    };
  
    const handleAddResourceField = () => {
      setNewResources([...newResources, { id: 0, name: '', date: new Date().toISOString().slice(0, 10), quantity: 0 }]); // New resource with current date
    };
  
    const handleCancel = () => {
      setNewResources([{ id: 0, name: '', date: new Date().toISOString().slice(0, 10), quantity: 0 }]); // Reset form
      setError(''); // Clear any error messages
    };
  
    const handleViewResources = () => {
      // Implement your logic to view resources (e.g., navigate to another page or open a modal)
      console.log(newResources); // Replace this with your desired action
    };
  

const resourceUpdate = () => {
  return (
    <div>
            
      <Header />
      <div className="container">
        <button className="view-resources-button" onClick={handleViewResources}>
          View Resources
        </button>
        <h1 className="title">Resource Planning System</h1>
        {error && <div className="error-message">{error}</div>}
        <div className="form-container">
          <h2 className="form-title"><strong>New Resources</strong></h2>
          <form>
            {newResources.map((resource, index) => (
              <div key={index} className="resource-form-group">
                <div className="form-group">
                  <label htmlFor={`name-${index}`}>Item Name:</label>
                  <select
                    id={`name-${index}`}
                    value={resource.name}
                    onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                  >
                    <option value="">Select Resource</option>
                    {resourceNames.map((name, idx) => (
                      <option key={idx} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor={`date-${index}`}>Date:</label>
                  <input
                    id={`date-${index}`}
                    type="date"
                    value={new Date().toISOString().slice(0, 10)} // Always set to today's date
                    readOnly // Make the date input read-only
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`quantity-${index}`}>Quantity:</label>
                  <input
                    id={`quantity-${index}`}
                    type="number"
                    value={resource.quantity}
                    onChange={(e) => handleResourceChange(index, 'quantity', e.target.value)} // Pass the string value to validate
                  />
                </div>
              </div>
            ))}
            <div className="form-actions">
              <button className="btn btn-primary" type="button" onClick={handleSaveResources} disabled={loading}>
                Save
              </button>
              <button className="btn btn-secondary" type="button" onClick={handleAddResourceField}>
                Add Another Resource
              </button>
              <button className="btn btn-cancel" type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
      

  )
}

export default resourceUpdate
