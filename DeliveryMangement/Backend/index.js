//package
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./route/ReportRoute.js";
import cors from "cors";
// import DashBoardRoute from "./route/DashBoardRoute.js"; //this route is not use in this file so remove it

const app = express();

//middelware
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

//conect port and url env
const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

//check a database connection 
mongoose.connect(MONGOURL).then(() => {
        console.log("MongoDB connected"); //message
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    })

 app.use("/api/Report",route);
 app.use("/api/DashBoardRoute", route);
