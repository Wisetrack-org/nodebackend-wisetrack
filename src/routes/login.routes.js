import { studentLogin } from "../controllers/loginController/student.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/studentLogin").get(studentLogin);

export default router;

