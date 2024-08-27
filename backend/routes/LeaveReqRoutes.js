import express from "express";
import { fetchAllLeave , addLeaveRequest} from "../controllers/LeaveReqcontrol.js";  // Ensure the correct path and case

const LeaveReqRoutes = express.Router();

// Route to fetch all leave requests
LeaveReqRoutes.get("/", fetchAllLeave);
LeaveReqRoutes.post("/",express.json(),addLeaveRequest);

export default LeaveReqRoutes;
