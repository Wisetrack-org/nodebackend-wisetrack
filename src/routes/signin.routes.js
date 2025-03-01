import { studentLogin, teacherLogin, universityLogin } from "../controllers/signin.controllers.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/studentSignin").post(studentLogin);
router.route("/teacherSignin").post(teacherLogin);
router.route("/universitySignin").post(universityLogin);

router.route("/protectedRoute").get(verifyJWT, (req, res) => {
    res.status(200).json({ message: "Protected route accessed", user: req.user });
});


export default router;

