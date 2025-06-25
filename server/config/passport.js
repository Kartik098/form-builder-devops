// config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const axios = require("axios")

const User = require("../schemas/userSchema.js");
const Account = require("../schemas/accountSchema.js");

const CLIENT_URL = "http://localhost:3000"; // Frontend

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos?.[0]?.value,
          });
        }

        await Account.findOneAndUpdate(
          {
            provider: "google",
            providerAccountId: profile.id,
          },
          {
            userId: user._id,
            provider: "google",
            providerAccountId: profile.id,
            access_token: accessToken,
          },
          { upsert: true, new: true }
        );

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
    },
   async (accessToken, refreshToken, profile, done) => {
      try {
        // Fetch primary email if not in profile
        let email = null;

        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        } else {
          // 🔁 GitHub fallback: get user emails via API
          const emailRes = await axios.get("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${accessToken}`,
              "User-Agent": "OAuth App",
            },
          });

          const primaryEmailObj = emailRes.data.find((e) => e.primary && e.verified);
          email = primaryEmailObj?.email;
        }

        if (!email) return done(new Error("GitHub email not available"));

        const image = profile.photos?.[0]?.value || null;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.username,
            email,
            image,
          });
        }

        // Check if account exists
        let account = await Account.findOne({
          provider: 'github',
          providerAccountId: profile.id,
        });

        if (!account) {
          await Account.create({
            userId: user._id,
            provider: 'github',
            providerAccountId: profile.id,
            accessToken,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("GitHubStrategy Error:", err.message);
        return done(err);
      }
    }
  )
);
