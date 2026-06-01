import { Router } from 'express';
import multer from 'multer';
import { login } from '../controllers/authController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';
import { getAllPosts, getPostForEdit, createPost, updatePost, deletePost, publishPost, unpublishPost, } from '../controllers/blogController.js';
import { uploadMedia, deleteMedia } from '../controllers/mediaController.js';
const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
// Auth (public)
router.post('/admin/login', login);
// Blog CRUD (protected)
router.get('/admin/posts', requireAdmin, getAllPosts);
router.get('/admin/posts/:id', requireAdmin, getPostForEdit);
router.post('/admin/posts', requireAdmin, createPost);
router.put('/admin/posts/:id', requireAdmin, updatePost);
router.delete('/admin/posts/:id', requireAdmin, deletePost);
router.post('/admin/posts/:id/publish', requireAdmin, publishPost);
router.post('/admin/posts/:id/unpublish', requireAdmin, unpublishPost);
// Media (protected)
router.post('/admin/media/upload', requireAdmin, upload.single('file'), uploadMedia);
router.delete('/admin/media', requireAdmin, deleteMedia);
export default router;
