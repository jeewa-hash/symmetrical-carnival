import express from "express";


import {getCompletedDeliveriesCount} from "../controler/dashboardController.js";

//route direction
router.get("/completed-deliveries-count", getCompletedDeliveriesCount)

export default router