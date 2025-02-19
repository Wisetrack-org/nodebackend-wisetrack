import { studentLogin } from "../controllers/signin.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/studentSignin").get(studentLogin);

export default router;

