import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema({
  basicSalary: {
      type: Number,
      required: true,
  },
  allowances: {
      type: Number,
      required: true,
  },
  deductions: {
      type: Number,
      required: true,
  },
  grossSalary: {
      type: Number,
      required: true,
  },
  netSalary: {
      type: Number,
      required: true,
  },
  createdAt: {
      type: Date,
      required: true,
  },
});

export default mongoose.model("salarycalculate", SalarySchema);
