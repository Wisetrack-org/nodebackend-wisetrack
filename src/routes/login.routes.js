import { studentLogin } from "../controllers/login.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/studentLogin").get(studentLogin);

export default router;

