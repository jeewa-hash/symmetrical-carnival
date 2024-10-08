import React, { useState, useEffect } from 'react';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../image/design.png'; 

const departments = [
  'Production Department',
  'Supply Chain and Procurement Department',
  'Sales and Marketing Department',
  'Order Management Department',
  'Human Resources Department',
  'Finance Department',
  'Logistics and Warehouse Department',
];

const employeeTypes = ['Permanent', 'Contract'];

const departmentToDesignation = {
  'Production Department': [
    { name: 'Production Manager', role: 'Permanent' },
    { name: 'Machine Operator', role: 'Contract' },
    { name: 'Production Worker', role: 'Contract' },
  ],
  'Supply Chain and Procurement Department': [
    { name: 'Supply Chain Manager', role: 'Permanent' },
    { name: 'Warehouse Manager', role: 'Permanent' },
    { name: 'Inventory Controller', role: 'Contract' },
  ],
  'Sales and Marketing Department': [
    { name: 'Sales Manager', role: 'Permanent' },
    { name: 'Marketing Manager', role: 'Permanent' },
    { name: 'Sales Representative', role: 'Contract' },
  ],
  'Order Management Department': [
    { name: 'Order Manager', role: 'Permanent' },
    { name: 'Order Fulfillment Coordinator', role: 'Contract' },
  ],
  'Human Resources Department': [
    { name: 'HR Manager', role: 'Permanent' },
    { name: 'Training and Development Officer', role: 'Contract' },
  ],
  'Finance Department': [
    { name: 'Finance Manager', role: 'Permanent' },
    { name: 'Financial Analyst', role: 'Contract' },
  ],
  'Logistics and Warehouse Department': [
    { name: 'Delivery Manager', role: 'Permanent' },
    { name: 'Delivery Driver', role: 'Contract' },
    { name: 'Inventory Specialist', role: 'Contract' },
  ],
};

const AddEmployeeForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState(departments[0]);
  const [designation, setDesignation] = useState('');
  const [employeeType, setEmployeeType] = useState(employeeTypes[0]);
  const [baseSalary, setBaseSalary] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [message, setMessage] = useState('');

  const [currentDate, setCurrentDate] = useState('');
  const navigate = useNavigate();

  // Validation for employee ID - max 5 digits
  const validateEmployeeId = (id) => /^[0-9]{1,5}$/.test(id);
  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateNIC = (nic) => {
    const lengthValid = nic.length === 12 || (nic.length === 10 && /^[0-9]{9}[Vv]$/.test(nic));
    return lengthValid;
  };

  const validateSalary = (salary) => salary > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmployeeId(employeeId)) {
      setMessage('Employee ID must be numeric and up to 5 digits.');
      return;
    }

    if (!validateName(firstName) || !validateName(lastName)) {
      setMessage('Names can only contain letters and spaces.');
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email.');
      return;
    }

    if (!validateNIC(nic)) {
      setMessage('NIC must be 12 digits or 9 digits followed by V/v.');
      return;
    }

    if (!validateSalary(parseFloat(baseSalary))) {
      setMessage('Base Salary must be a positive number.');
      return;
    }

    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    if (age < 18) {
      setMessage('Employee must be at least 18 years old.');
      return;
    }

    const joining = new Date(joiningDate);
    const birth = new Date(dateOfBirth);
    if (joining <= birth) {
      setMessage('Joining date must be after date of birth.');
      return;
    }

    try {
      const response = await axios.post('/api/employee', {
        firstName,
        lastName,
        email,
        nic,
        department,
        employeeId,
        employeeType,
        designation,
        baseSalary: parseFloat(baseSalary),
        dateOfBirth,
        joiningDate: currentDate,
      });

      setMessage(response.data.msg || 'Employee added successfully!');
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while adding the employee.');
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setNic('');
    setDepartment(departments[0]);
    setEmployeeId('');
    setEmployeeType(employeeTypes[0]);
    setDesignation('');
    setBaseSalary('');
    setDateOfBirth('');
    setJoiningDate(currentDate);
  };

  const handleIdKeyPress = (event) => {
    const charCode = event.charCode;
    if (!/[0-9]/.test(String.fromCharCode(charCode))) {
      event.preventDefault();
    }
  };

  const handleNameKeyPress = (event) => {
    const charCode = event.charCode;
    if (!/[a-zA-Z\s]/.test(String.fromCharCode(charCode))) {
      event.preventDefault();
    }
  };

  const handleNicChange = (event) => {
    const value = event.target.value;
    if (/^\d{0,12}$/.test(value) || /^\d{9}[Vv]?$/.test(value)) {
      setNic(value);
    }
  };

  const handleViewEmployees = () => {
    navigate('/emptable');
  };

  const getDesignationOptions = () => {
    return departmentToDesignation[department]
      .filter((desig) => desig.role === employeeType)
      .map((desig) => desig.name);
  };

  // Set the current date when the component mounts and prevent joining date from changing
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setCurrentDate(formattedDate);
    setJoiningDate(formattedDate); // Joining date restricted to today
  }, [department, employeeType]);

  const maxDate = new Date().getFullYear() - 18;
  const minDate = '1900-01-01';
  const restrictedMaxDate = `${maxDate}-12-31`;

  return (
    <div
      className="bg-gray-100 min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Header />
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg mt-10 bg-opacity-90">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Add Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyPress={handleNameKeyPress}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyPress={handleNameKeyPress}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-1">
              NIC
            </label>
            <input
              id="nic"
              type="text"
              value={nic}
              onChange={handleNicChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <input
              id="employeeId"
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              onKeyPress={handleIdKeyPress}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <select
              id="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {getDesignationOptions().map((desig) => (
                <option key={desig} value={desig}>
                  {desig}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700 mb-1">
              Employee Type
            </label>
            <select
              id="employeeType"
              value={employeeType}
              onChange={(e) => setEmployeeType(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {employeeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="baseSalary" className="block text-sm font-medium text-gray-700 mb-1">
              Base Salary
            </label>
            <input
              id="baseSalary"
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={restrictedMaxDate}
              min={minDate}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700 mb-1">
              Joining Date
            </label>
            <input
              id="joiningDate"
              type="date"
              value={joiningDate}
              readOnly // The joining date is restricted to today's date
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add Employee
            </button>
            <button
              type="button"
              onClick={handleViewEmployees}
              className="w-full bg-gray-500 text-white font-semibold py-3 px-4 mt-3 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              View Employees
            </button>
          </div>
          {message && (
            <div className="mt-4 text-center">
              <p className="text-red-500 font-semibold">{message}</p>
            </div>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddEmployeeForm;
