const express = require('express');
const router = express.Router();
const User = require('../schemas/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";


// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    const query = new URLSearchParams({
      token,
      name: user.name || "",
      email: user.email || "",
    }).toString();

    res.redirect(`http://frontend:3000/auth/callback?${query}`);
  }
);

// GitHub OAuth Callback


// GitHub OAuth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    const query = new URLSearchParams({
      token,
      name: user.name || "",
      email: user.email || "",
    }).toString();

    res.redirect(`http://frontend:3000/auth/callback?${query}`);
  }
);
module.exports = router;
