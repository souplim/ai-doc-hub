import express from "express";
import cors from "cors";
import "dotenv/config";
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; // Passport 전략 등록 (side-effect import)
import authRouter from "./routes/auth.routes.js";
import apiRouter from "./routes/api.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5000",
    credentials: true,
  }),
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax", // CSRF 공격 방지
      maxAge: 1000 * 60 * 60 * 24, // 24시간
    },
  }),
);

app.use(passport.initialize()); // req에 passport 기능 추가
app.use(passport.session()); // 로그인 상태 유지 위해 세션에서 사용자 정보 읽어 req.user에 저장

app.use("/auth", authRouter);
app.use("/api", apiRouter);

export default app;
