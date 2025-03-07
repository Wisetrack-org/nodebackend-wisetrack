import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getStudentDashbpoard, sendCode } from "../controllers/student.controllers.js";

const router = Router();

router.route("/studentProfile").get(verifyJWT, getStudentDashbpoard);
router.route("/auth").patch(sendCode)


export default router;