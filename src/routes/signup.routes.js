import { studentSignup, teacherSignup, universitySignup } from "../controllers/signup.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/studentSignup").post(studentSignup);
router.route("/teacherSignup").post(teacherSignup);
router.route("/universitySignup").post(universitySignup);

export default router;