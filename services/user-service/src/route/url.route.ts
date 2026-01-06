import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createUrl } from "../controllers/urls.js"

const router = express.Router()

router.post("/create",authMiddleware,createUrl)

export default router