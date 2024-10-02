// packages
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

// utiles
import connectDB from './config/db.js';
import productRoutes from './routes/ProductRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';
import uploadRoutes from './routes/UploadRoutes.js';
import salarycalculatorrouter from './routes/salarycalculatorrouter.js';
import billOrderRouter from './routes/billOrderRouter.js';

// Load the .env file
dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Define routes
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/salarycalculates', salarycalculatorrouter);
app.use('/api/billorder', billOrderRouter);

const __dirname = path.resolve();
app.use("/uploads/products", express.static(path.join(__dirname, '/uploads/products')));

app.listen(port, () => console.log(`Server running on port: ${port}`));
