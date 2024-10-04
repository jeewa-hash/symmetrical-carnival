import mongoose from 'mongoose';

// Define the schema for an employee
const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  employeeType: {
    type: String,
    required: true,
    trim: true
  },
  baseSalary: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('employee', employeeSchema);
