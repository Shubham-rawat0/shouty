import express from "express"
import { resolveUrl } from "../controllers/urls.js"

const router = express.Router()

router.get("/:code",resolveUrl)

export default router