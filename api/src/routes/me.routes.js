import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserScreens } from "../controllers/me.controller.js";

const router = Router();

router.route("/screens").get(verifyJWT, getUserScreens);

export default router;
