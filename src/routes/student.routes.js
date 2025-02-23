import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/protectedRoute").get(verifyJWT, (req, res) => {
    res.status(200).json({ message: "Protected route accessed", user: req.user });
});


export default router;