import { teacherDashboard } from "../controllers/teachers.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/teacherDashboard").get(verifyJWT, teacherDashboard);

export default router;