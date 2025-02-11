import express from 'express';
import { components, recent, repositories, socialMedia } from '../controllers/itemsController.js';


const router = express.Router();

router.get('/repositories', repositories);
router.get('/components', components);
router.get('/social_media', socialMedia);
router.get('/recent', recent);
export default router;