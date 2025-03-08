import { teacherDashboard, timeTableUpload } from "../controllers/teachers.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/teacherDashboard").get(verifyJWT, teacherDashboard);
router.route("/uploadFile").post(verifyJWT, timeTableUpload);

export default router;