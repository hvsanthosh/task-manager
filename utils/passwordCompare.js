import User from "../models/User.js";
import bcrypt from "bcryptjs";
const comparePassword = async (userMail, userPassword) => {
  console.log(userMail);
  const user = await User.findOne({ email: userMail });
  console.log(user);
  const isMatch = await bcrypt.compare(userPassword, user.password);
  console.log(isMatch);
  return isMatch;
};

export { comparePassword };
