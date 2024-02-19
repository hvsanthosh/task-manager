import User from "../models/User.js";
import { comparePassword } from "../utils/passwordCompare.js";
// controller for registering takes in unique email, password, name, phone number for cron calling purpose.
// priority will be set automatically using cron logic based on tasks completion status and due_date.
// JWT are used for authentication purpose.
// password is encrypted and stored using bcryptjs library.
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(201).json({
    message: "user created successfully",
    user: { name: user.name },
    token,
  });
};

// Login using the register email and valid password.

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Please provide email or password" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: "Invalid Credentials" });
  }
  const isPasswordCorrect = await comparePassword(email, password);
  if (!isPasswordCorrect) {
    res.status(401).json({ message: "Invalid Credentials" });
  }
  // compare password
  const token = user.createJWT();
  res
    .status(200)
    .json({ message: "Login Successful", user: { name: user.name }, token });
};

export { register, login };
