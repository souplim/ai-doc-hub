import { Router } from "express";
import { getMe } from "../controllers/auth.controller.js";
import { streamChat } from "../controllers/chat.controller.js";

const router = Router();

router.get("/me", getMe);
router.post("/chat", streamChat);

export default router;
