import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true, // Ensure each employee ID is unique
  },
  department: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  employeeRole: {
    type: String,
    required: true,
    enum: ["Permanent", "Contract"],
  },
  payrollMonth: {
    type: String,
    required: true,
  },
  basicSalary: {
    type: Number,
    required: true,
    min: 0,
  },
  actualHours: {
    type: Number,
    required: true,
    min: 0,
  },
  unpaidLeaveDays: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

// Method to calculate net salary
SalarySchema.methods.calculateNetSalary = function () {
  const grossSalary = this.basicSalary; // Calculate gross salary based on your logic
  const deductions = 0.08 * this.basicSalary + // EPF deduction
                    0.03 * this.basicSalary + // ETF deduction
                    this.unpaidLeaveDays * (this.basicSalary / (this.employeeRole === 'Permanent' ? 40 : 30)); // Leave deduction

  return grossSalary - deductions;
};

export default mongoose.model("Salary", SalarySchema);
