import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  try {
    // ✅ Support both Cookie and Authorization header
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Attach both ID and user object
    req.userId = user._id; // ✅ only the ID
    req.user = user;       // ✅ full user object

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;
