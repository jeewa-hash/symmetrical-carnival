import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    password: '',
    rePassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if passwords match
    if (formData.password !== formData.rePassword) {
      alert("Passwords do not match");
      return;
    }
    console.log(formData);
    // Handle registration logic here (e.g., API call)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">Register</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="employeeId">Employee ID</label>
          <input 
            type="text" 
            id="employeeId" 
            name="employeeId" 
            value={formData.employeeId} 
            onChange={handleChange} 
            required 
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-pink-200" 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-pink-200" 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-pink-200" 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="rePassword">Re-enter Password</label>
          <input 
            type="password" 
            id="rePassword" 
            name="rePassword" 
            value={formData.rePassword} 
            onChange={handleChange} 
            required 
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-pink-200" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-pink-600 text-white font-semibold py-2 rounded hover:bg-pink-500 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
