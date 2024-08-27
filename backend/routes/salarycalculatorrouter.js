import express from "express";
const salarycalculatorrouter = express.Router();

import { addSalary, fetchAllSalary, getAllSalaryCalculatesById  } from "../controllers/salarycalculatecontroller.js";

// addsalary
salarycalculatorrouter.post("/" , express.json(), addSalary);

//fetchsalary
salarycalculatorrouter.get("/" , fetchAllSalary);

//fetchsalarybyid
salarycalculatorrouter.get("/:id" , getAllSalaryCalculatesById);

export default salarycalculatorrouter