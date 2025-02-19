import { signup } from "../controllers/signup.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/studentSignup").post(signup);

export default router;