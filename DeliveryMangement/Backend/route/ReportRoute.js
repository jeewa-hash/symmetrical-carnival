import express from "express";
import { 
    listreport, //list 
    addReport,  //add
    updateReport, //update
    deleteReport  //delete
} from "../controler/ReportControler.js";

const route = express.Router();

//route direction
route.post("/add", addReport)
route.get("/list", listreport)
route.put("/update/:id", updateReport)
route.delete("/delete/:id", deleteReport)



export default route;

