import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getUserProfile } from "../controllers/student.controllers.js";

const router = Router();

router.route("/studentProfile").get(verifyJWT, getUserProfile);


export default router;