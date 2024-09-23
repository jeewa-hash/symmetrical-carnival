import express from 'express';
import {
  addSalary,
  fetchAllSalaries,
  fetchSalaryById,
  updateSalary,
  deleteSalary,
} from '../controllers/salarycalculatecontroller.js';

const SalaryRoute = express.Router();

SalaryRoute.get("/", fetchAllSalaries);
SalaryRoute.post("/", express.json(), addSalary);
SalaryRoute.get("/:id", fetchSalaryById);
SalaryRoute.put("/:id", express.json(), updateSalary);
SalaryRoute.delete("/:id", deleteSalary);

export default SalaryRoute;
