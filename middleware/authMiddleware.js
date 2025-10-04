const jwt = require("jsonwebtoken");
const User = require("../models/user");

const secret = process.env.JWT_SECRET || "verysecret";

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });

  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.id);
    if (!user)
      return res.status(401).json({ message: "Invalid token user not found" });

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: err.message });
  }
}

module.exports = authMiddleware;
