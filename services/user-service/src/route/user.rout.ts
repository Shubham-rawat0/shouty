import express from "express"
import { googleAuth, googleAuthCallback } from "../controllers/googleAuth.js";
import { getUser, Logout, Signin, Signup } from "../controllers/user.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post("/signup",Signup)
router.post("/signin",Signin)
router.get("/logout",Logout)
router.get("/userInfo",authMiddleware,getUser)

router.get("/auth/google", googleAuth());
router.get("/auth/google/callback", googleAuthCallback());


export default router