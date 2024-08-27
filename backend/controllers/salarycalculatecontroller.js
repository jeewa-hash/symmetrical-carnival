import salarycalculateModel from "../models/salarycalculateModel.js";

//add new salary record
export const addSalary = async (req, res) => {
    try {
        console.log(req.fields);
        const {basicSalary, allowances, deductions, grossSalary, netSalary,createdAt  } = req.fields;
        
        switch(true) {
            case !basicSalary:
                return res.json( { error: "basic salary is required" } );
            case !allowances:
                return res.json( { error: "allowances is required" } );
            case !deductions:
                return res.json( { error: "deductions is required" } );
            case !grossSalary:
                return res.json( { error: "gross salary is required" } );
            case !netSalary:
                return res.json( { error: "net salary is required" } );
            case !createdAt:
                return res.json( { error: "date is required" } );
        }

        const salary = new salarycalculateModel({...req.fields});
        await salary.save();
        res.status(201).json( { msg : "Salary record Added Successfully" } );
    } catch (error) {
        console.error(error);
        res.status(400).json( { msg : "Salary record Adding Failed ", error } );
    }
}

// fetch all salary records
export const fetchAllSalary = async (req, res) => {
    try {
        const salary = await salarycalculateModel.find();
        res.json(salary);
    } catch (error) {
        res.status(400).json( { msg : "No Salary record Found", error } );
    }
}

//fetch all salary by id
export const getAllSalaryCalculatesById = async (req, res) => {
    try {
        const salary = await salarycalculateModel.findById(req.params.id);
        if(!salary) {
            return res.status(404).json( { msg : "Salary Record Not Found" } );
        }
        res.json(salary);
    } catch (error) {
        res.status(404).json( { msg : "Cannot find this salary record", error } );
    }
}


