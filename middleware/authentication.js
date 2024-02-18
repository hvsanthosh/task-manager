import jwt from "jsonwebtoken";

// middleware to authenticate user based on the token present in heder(Authoriation)
const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    // console.log(payload);
    // console.log(payload.user_id);
    req.user = { user_id: payload.user_id };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
export default auth;
