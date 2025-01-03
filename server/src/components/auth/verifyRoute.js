import passport from "passport";
const authorize = (isAdminRequired = false) => async (req, res, next) => {
    passport.authenticate("jwt", { session: false }, async (err, user) => {
      console.log("User:", user);
      if (err || !user) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
      if (isAdminRequired && !user.is_admin) {
        return res.status(403).json({ message: "Forbidden: Admins only" });
      }

      req.user = user;
      next();
    })(req, res, next);
  };

export { authorize };
