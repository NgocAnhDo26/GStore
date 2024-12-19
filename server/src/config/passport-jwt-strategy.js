
import { prisma } from "./config.js";
import passport from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";


let opt = {
  jwtFromRequest: (req) => {
  
    return req.cookies.authToken || null;
  },
  secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(
  new JWTStrategy(opt, async function (jwtPayLoad, done) {
    try {
      const user = await prisma.account.findUnique({
        where: {
          id: jwtPayLoad._id,
        },
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      console.log("Error in finding user from jwt", err);
      return done(err, false);
    }
  })
);

export default passport;
