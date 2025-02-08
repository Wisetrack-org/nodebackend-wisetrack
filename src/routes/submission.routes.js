import { Router } from "express";
import { studentSubmission, teacherSubmission } from "../controllers/submission.controllers.js";

const router = Router();

router.route("/student").post(studentSubmission);
router.route("/teacher").post(teacherSubmission);

export default router;