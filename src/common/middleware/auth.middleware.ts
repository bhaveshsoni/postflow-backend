import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import asyncHandler from 'express-async-handler';
import User from "../../models/user.model";


export interface AuthRequest extends Request {
  user?: any;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Grab token from cookies instead of headers
    const token = req.cookies.token; 

    if (!token) {
      // 💡 Professional tip: consistent error messages
      return res.status(401).json({ message: "Not authorized, no session cookie found" });
    }

    // 2. Verify the cookie token
    const decoded = verifyToken(token);
    
    // 3. Attach decoded user to request
    req.user = decoded;

    next();
  } catch (error) {
    // If token is tampered with or expired
    return res.status(401).json({ message: "Session expired or invalid" });
  }
};

export const getMe = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user.userId);
  
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return; // ✅ Fixes the same type error here
  }

  res.status(200).json({
    user: {
      email: user.email,
      isFacebookConnected: !!user.socialAccounts?.facebook?.accessToken,
      facebookPageName: user.socialAccounts?.facebook?.pageName
    }
  });
});