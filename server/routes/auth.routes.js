import { Router } from "express";
import passport from "passport";
import { googleCallback, logout } from "../controllers/auth.controller.js";

const router = Router();

const CLIENT_URL = () => process.env.CLIENT_URL || "http://localhost:5000";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL()}?error=auth_failed`,
  }),
  googleCallback,
);

router.post("/logout", logout);

export default router;
