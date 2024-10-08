import express from "express";


import {getCompletedDeliveriesCount} from "../controllers/dashboardController.js";

//route direction
router.get("/completed-deliveries-count", getCompletedDeliveriesCount)

export default router