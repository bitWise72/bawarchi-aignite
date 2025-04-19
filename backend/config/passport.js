import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js"; // Use ES module import
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile);

      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // If user doesn't exist, create a new user
        user = new User({
          googleId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          picture: profile.photos?.[0]?.value, // Profile image
        });
        await user.save();
      }

      return done(null, user);
    }
  )
);

// Serialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize User
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
