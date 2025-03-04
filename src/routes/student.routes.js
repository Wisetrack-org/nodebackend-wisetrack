import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getStudentDashbpoard } from "../controllers/student.controllers.js";

const router = Router();

router.route("/studentProfile").get(verifyJWT, getStudentDashbpoard);


export default router;