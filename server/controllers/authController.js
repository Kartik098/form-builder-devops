// POST /api/register
import bcrypt from "bcrypt";
import User from "../schemas/userSchema.js";
import Account from "../schemas/accountSchema.js";

const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret"; // Store in .env

// POST /api/register


const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password)
      return res.status(400).json({ error: "Name, email, and password are required." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "Email is already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      hashedPassword, // stored directly in User, NOT in Account
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};



export { register, login}