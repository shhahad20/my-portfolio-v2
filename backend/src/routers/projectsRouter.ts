import { Router } from 'express';
import { projects } from "../controllers/projectsController.js";

const router = Router();

router.get('/projects', projects);

export default router;