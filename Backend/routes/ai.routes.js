import express from "express";
import { chatWithAI } from "../utils/groq.js";
import { isAuthUser } from "../middleware/auth.middleware.js";
let router = express.Router();

router.post("/response", isAuthUser ,chatWithAI);

export default router