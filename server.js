import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import urouter from "./routes/users.js";
import tvrouter from './routes/tv_series.js';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

const app = express();

const uploadsDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'uploads');
app.use('/uploads', express.static(uploadsDirectory));

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.use(urouter)
app.use(tvrouter)

app.listen(process.env.PORT, () => {
    console.log(`run on port ${process.env.PORT}`);
});