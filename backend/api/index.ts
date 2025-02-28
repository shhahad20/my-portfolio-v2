import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import itemsRouter from "../src/routers/itemsRouter.js";
import aiChatRouter from "../src/routers/aiChatRouter.js";
import apiErrorHandler from '../src/middlewares/errorHandler.js';
import homeRouter from '../src/routers/homeRouter.js';


config()
const app = express() 
// const PORT = 3001

app.use('/public',express.static('public'))

// app.use(cookieParser())

// app.use(morgan('dev'))
// app.use(cors({
//   origin: 'https://my-portfolio-v2-jet.vercel.app',
//   credentials: true,
// }));
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true
}));

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  next();
});
app.use('/', homeRouter)
app.use('/api', itemsRouter)
app.use('/api', aiChatRouter)

app.use(apiErrorHandler);

// app.listen(PORT, async () => {
//   console.log('Server running http://localhost:' + PORT)
// }) 

// For local development you might create a separate file that imports the app and starts the server.
// For Vercel, simply export the app.
export default app;