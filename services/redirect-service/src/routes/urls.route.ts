import express from "express"
import { getLongUrl } from "../controllers/url.controller.js"
const router=express.Router()


router.get("/:url",getLongUrl)
export default router