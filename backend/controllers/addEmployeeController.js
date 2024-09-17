import Employee from '../models/AddEmployeeModel.js';

// Create a new employee
export const createEmployee = async (req, res) => {
  const { firstName, lastName, email, department, employeeId, employeeType, baseSalary } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !department || !employeeId || !employeeType || !baseSalary) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      department,
      employeeId,
      employeeType,
      baseSalary
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    if (error.code === 11000) { // Handle duplicate email or employeeId
      return res.status(400).json({ message: 'Employee with this email or ID already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an employee
export const updateEmployee = async (req, res) => {
  const { firstName, lastName, email, department, employeeId, employeeType, baseSalary } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !department || !employeeId || !employeeType || !baseSalary) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, department, employeeId, employeeType, baseSalary },
      { new: true }
    );
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an employee
export const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
