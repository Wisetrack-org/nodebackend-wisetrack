import { predictStudent } from "../controllers/aI.controllers.js";
import { Router } from "express";

const router = Router();

// router.route("/predict-student").post(predictStudent);
router.route("/predict-student").post(predictStudent);

export default router;
