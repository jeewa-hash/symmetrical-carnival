import express from 'express';
import {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} from '../controllers/addEmployeeController.js';  // Ensure the correct path and case

const EmployeeRoutes = express.Router();

// Route to create a new employee
EmployeeRoutes.post("/", express.json(), createEmployee);

// Route to get all employees
EmployeeRoutes.get("/", getEmployees);

// Route to get an employee by ID
EmployeeRoutes.get("/:id", getEmployeeById);

// Route to update an employee by ID
EmployeeRoutes.put("/:id", express.json(), updateEmployee);

// Route to delete an employee by ID
EmployeeRoutes.delete("/:id", deleteEmployee);

export default EmployeeRoutes;
