import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyToken = asyncHandler(async(req, res, next) => {
  const authHeader = req.headers.authorization;
  

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; // attach user info
    // console.log("DECODED:", decoded);

  next();
});

//to verify the role of the user (Createing Role Middleware)

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission."
      });
    }
    next();
  };
};

