import { getUniDashboard } from "../controllers/university.controllers.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/universityDashboard").get(verifyJWT, getUniDashboard);

export default router;