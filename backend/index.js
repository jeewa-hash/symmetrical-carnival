// packages
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from "path";

// utiles
import connectDB from "./config/db.js";
import productRoutes from "./routes/ProductRoutes.js";
import categoryRoutes from "./routes/CategoryRoutes.js"
import uploadRoutes from './routes/UploadRoutes.js';

// load the .env file
dotenv.config();
const port = process.env.PORT || 5000;

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded( { extended: true } ))
app.use(cookieParser())

app.use("/api/category", categoryRoutes);
app.use("/api/products" , productRoutes);
app.use("/api/upload", uploadRoutes);

const __dirname = path.resolve();
app.use("/uploads/products", express.static(path.join(__dirname + '/uploads/products')));

app.listen(port, () => console.log(`server running on port: ${port}`));