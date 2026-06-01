import { Router } from 'express';
import { getPublishedPosts, getPostBySlug } from '../controllers/blogController.js';
const router = Router();
router.get('/blog/posts', getPublishedPosts);
router.get('/blog/posts/:slug', getPostBySlug);
export default router;
