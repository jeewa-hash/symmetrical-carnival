import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from "path";
import cors from 'cors';

// Utilities
import OrderRoute from './routes/OrderRoute.js';
import connectDB from "./config/db.js";
import productRoutes from "./routes/ProductRoutes.js";
import categoryRoutes from "./routes/CategoryRoutes.js";
import uploadRoutes from './routes/UploadRoutes.js';
import RawMaterial from './routes/RawMaterialRoute.js';
import FinishingGoodsRoute from './routes/FinishingGoodsRoute.js';
import RawMaterialRequest from './routes/RawMaterialRequestRoute.js';
import MonthlyEvalution from './routes/MonthlyEvalutionRoute.js';
import ProductionRequest from './routes/ProductionRequestRoute.js';


// Load the .env file
dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Change this to your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    credentials: true // Optional, if you need to support cookies
}));

app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/order", OrderRoute);
app.use("/api/rawMaterial", RawMaterial);
app.use('/api/finishingGoods', FinishingGoodsRoute);
app.use('/api/rawMaterialRequest', RawMaterialRequest);
app.use('/api/monthlyEvaluation', MonthlyEvalution);
app.use('/api/productionRequest', ProductionRequest);


const __dirname = path.resolve();
app.use("/uploads/products", express.static(path.join(__dirname, '/uploads/products')));

app.listen(port, () => console.log(`server running on port: ${port}`));
