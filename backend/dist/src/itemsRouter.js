import express from 'express';
import { components, repositories, socialMedia } from './controllers/itemsController';
const router = express.Router();
router.get('/repositories', repositories);
router.get('/components', components);
router.get('/social-media', socialMedia);
export default router;
