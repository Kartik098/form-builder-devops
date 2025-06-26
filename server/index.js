require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const formRoutes = require('./routes/formRoutes');
const authRoutes = require('./routes/authRoutes');
require("./config/passport");
const PORT = 5000;
const session = require("express-session");
const passport = require("passport");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "another_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://mongo:27017/formbuilder', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => console.error('MongoDB connection error:', err));
app.use('/api/forms',formRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

