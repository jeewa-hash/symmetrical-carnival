import Salary from "../models/salarycalculateModel.js";

// Create a new salary record
export const addSalary = async (req, res) => {
  try {
    const newSalary = new Salary(req.body);
    await newSalary.save();
    res.status(201).json(newSalary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch all salary records
export const fetchAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find();
    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch a salary record by ID
export const fetchSalaryById = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }
    res.status(200).json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a salary record by ID
export const updateSalary = async (req, res) => {
  try {
    const updatedSalary = await Salary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedSalary) {
      return res.status(404).json({ message: "Salary record not found" });
    }
    res.status(200).json(updatedSalary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a salary record by ID
export const deleteSalary = async (req, res) => {
  try {
    const deletedSalary = await Salary.findByIdAndDelete(req.params.id);
    if (!deletedSalary) {
      return res.status(404).json({ message: "Salary record not found" });
    }
    res.status(200).json({ message: "Salary record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
