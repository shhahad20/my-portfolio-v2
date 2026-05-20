import { Router } from 'express';
import { getProjectById, projects } from "../controllers/projectsController.js";

const router = Router();

router.get('/projects', projects);
router.get("/projects/:id", getProjectById);


export default router;