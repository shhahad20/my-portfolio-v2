import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import itemsRouter from "../src/routers/itemsRouter.js";
import aiChatRouter from "../src/routers/aiChatRouter.js";
import apiErrorHandler from '../src/middlewares/errorHandler.js';

config()
const app = express() 
const PORT = 3001

app.use('/public',express.static('public'))

// app.use(cookieParser())

// app.use(morgan('dev'))
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', itemsRouter)
app.use('/api', aiChatRouter)

app.use(apiErrorHandler);

app.listen(PORT, async () => {
  console.log('Server running http://localhost:' + PORT)
}) 