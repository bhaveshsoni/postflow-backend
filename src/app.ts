import express, { Request, Response } from 'express';
import postRoutes from "./modules/post/post.routes";
import authRoutes from "./modules/auth/auth.routes";
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import path from 'path';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
//auth routes
app.use("/auth", authRoutes);


// Middleware
app.use(cors());
app.use(express.json());
 

app.use("/posts", postRoutes);


export default app;
