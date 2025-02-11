import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import itemsRouter from "../src/routers/itemsRouter.js";
config();
const app = express();
const PORT = 3001;
app.use('/public', express.static('public'));
// app.use(cookieParser())
// app.use(morgan('dev'))
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', itemsRouter);
// app.use(apiErrorHandler)
app.listen(PORT, async () => {
    console.log('Server running http://localhost:' + PORT);
});
