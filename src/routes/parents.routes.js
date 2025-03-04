import { parentDashboard } from "../controllers/parents.controllers.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/parentDashboard").get(verifyJWT, parentDashboard);

export default router;