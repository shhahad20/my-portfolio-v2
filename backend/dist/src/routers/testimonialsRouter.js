import { Router } from "express";
import { getTestimonials } from "../controllers/testimonialsController.js";
const router = Router();
router.get("/testimonials", getTestimonials);
export default router;
