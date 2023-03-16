const express = require("express");
const User = require("../DB/userModel");
const passport = require("passport");
const session = require("express-session");
const RedisStore = require('connect-redis')(session);
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const router = require("./userRouter");

const app = express();

router.use(
  session({
    store: new RedisStore(),
    cookie:{
      secure: true,
      maxAge:60000
         },
    secret: "deepan",
    resave: false,
    saveUninitialized: false,
  })
);

const SECRET_KEY = process.env.SECRET;
app.use(passport.initialize());
app.use(passport.session());

const jsonData = (condition, msg, result = null) => {
  return { status: condition, msg, result };
};

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "541116046406-rlpg5ecjcb7da3prsh025upd9kh0i9d4.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:9000/google/callback",
    },
    async (accesstoken, refreshtoken, profile, done) => {
      const user = await User.findOne({ googleId: profile.id });
      if (user) {

        if(!user.emailVerified){
          const updateEmailVerify = await User.findOneAndUpdate({googleId:user.googleId},{emailVerified:true})
        }
        // User exists, generate token and return it
        const token = await jwt.sign({ id: user._id }, process.env.SECRET, {
          expiresIn: "30m",
        });
        return done(null, token);
      } else {
        const existUser = await User.findOne({
          email: profile.emails[0].value,
        });
        console.log(existUser);
        if (existUser) {
          const findupdate = await User.findOneAndUpdate(
            { email: existUser.email },
            { googleId: profile.id,emailVerified:true }
          );
          if (findupdate) {
            const token = await jwt.sign({ id: findupdate._id }, process.env.SECRET, {
              expiresIn: "30m",
            });
            return done(null, token);
          } else {
            return done(null, false);
          }
        } else {
          // User doesn't exist, create a new user and generate token
          const newUser = await User.create({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
            emailVerified:true
          });
          const token = await jwt.sign({ id: newUser._id }, process.env.SECRET, {
            expiresIn: "30m",
          });
          return done(null, token);
        }
      }
    }
  )
);

// serialize user into a session
passport.serializeUser(function (token, done) {
  done(null, token);
});

// deserialize user from a session
passport.deserializeUser(function (token, done) {
  done(null, token);
});

// authenticate user with Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// handle Google OAuth 2.0 callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureMessage: "failedAuth" }),
  function (req, res) {
    // Successful authentication, redirect to home page.
    if (req.user) {
      const token = req.user;
      
      res.redirect(`${process.env.CLIENT_URL}/google/${token}`)
      // console.log("req.user", token);
      // res.status(200).send(jsonData(true,"Sign Successful With google",token));
    }else{
      res.status(200).send(jsonData(false,"google Sign problem"));
    }
  }
);

module.exports = router;
