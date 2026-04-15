import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (_accessToken, _refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value ?? "",
        photo: profile.photos?.[0]?.value ?? "",
      };
      return done(null, user);
    },
  ),
);

passport.serializeUser((user, done) => done(null, user)); // 세션에 사용자 정보 저장
passport.deserializeUser((user, done) => done(null, user)); // 세션에서 사용자 정보 읽기
