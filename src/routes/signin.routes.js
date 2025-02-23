import { studentLogin, teacherLogin, universityLogin } from "../controllers/signin.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/studentSignin").get(studentLogin);
router.route("/teacherSignin").get(teacherLogin);
router.route("/universitySignin").get(universityLogin);

export default router;

