import { studentLogin, teacherLogin, universityLogin } from "../controllers/signin.controllers.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/studentSignin").get(studentLogin);
router.route("/teacherSignin").get(teacherLogin);
router.route("/universitySignin").get(universityLogin);

router.route("/protectedRoute").get(verifyJWT, (req, res) => {
    res.status(200).json({ message: "Protected route accessed", user: req.user });
});


export default router;

