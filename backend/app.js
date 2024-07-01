import express from 'express';
import dotenv from 'dotenv';  
import cookieParser from 'cookie-parser';
import superAdmin from './routes/SuperAdmin.routes.js';
import student from './routes/Student.routes.js';
import admin from './routes/Admin.routes.js';
import quiz from "./routes/quiz.js"
import conn from "./database/conn.js";
import { errorMiddleware } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
 app.get("/",(req,res)=>{
    res.send("heeeee"); 
 })
app.use("/api/student/v1", student); 
app.use("/api/admin/v1", admin); 
app.use("/api/superAdmin/v1", superAdmin); 
app.use("/api/quiz", quiz); 
app.use(errorMiddleware);

export default app;