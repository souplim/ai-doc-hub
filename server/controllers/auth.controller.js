const CLIENT_URL = () => process.env.CLIENT_URL || "http://localhost:5000";

export function googleCallback(_req, res) {
  res.redirect(CLIENT_URL());
}

export function getMe(req, res) {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }
  res.status(401).json(null);
}

export function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);

    // 세션 완전히 제거
    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);

      res.clearCookie("connect.sid");
      res.json({ ok: true });
    });
  });
}
