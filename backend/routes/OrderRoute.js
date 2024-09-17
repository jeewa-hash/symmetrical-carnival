import express from 'express';
import { addOrder, fetchAllOrders, updateOrder, deleteOrder } from '../controllers/OrderController.js';

const OrderRoute = express.Router();

// Fetch all orders
OrderRoute.get("/", fetchAllOrders);

// Add a new order
OrderRoute.post("/", express.json(), addOrder);

// Update an existing order by ID
OrderRoute.put("/:orderId", express.json(), updateOrder);

// Delete an order by ID
OrderRoute.delete("/:orderId", deleteOrder);

export default OrderRoute;
