import { parentLogin, studentLogin, teacherLogin, universityLogin } from "../controllers/signin.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/studentSignin").post(studentLogin);
router.route("/teacherSignin").post(teacherLogin);
router.route("/universitySignin").post(universityLogin);
router.route("/parentSignin").post(parentLogin);

export default router;

