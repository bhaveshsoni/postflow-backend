import { Request, Response } from "express";
import { generateToken } from "../../common/utils/jwt";

import asyncHandler from 'express-async-handler';
import User from "../../models/user.model";
import bcrypt from "bcryptjs";
import { getFacebookLoginUrl, getFacebookTokenFromCode, getPermanentPageToken    } from "./oauth.service";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password, // hashed via pre-save hook
  });

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
  });

  res.status(201).json({ token });
};
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Invalid email or password" });
    return; // ✅ Explicitly return void
  }

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
  });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  });

  // ✅ Send response without returning it
  res.status(200).json({
    success: true,
    user: { id: user._id, email: user.email }
  });
});


export const getFacebookUrl = asyncHandler(async (req: any, res: Response) => {
  const url = getFacebookLoginUrl();
  res.status(200).json({ url });
});


export const updateToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {  
  const { code } = req.body;

  if (!code) {
    res.status(400).json({ success: false, message: "Code is missing" });
    return;
  }

  // 1. Exchange code for Short-Lived User Token
  const userToken = await getFacebookTokenFromCode(code);

  // 2. Exchange User Token for Permanent Page Token
  const pageData = await getPermanentPageToken(userToken); 

  // 3. Save to User Record (assuming your User model has these fields)
  const user = (req as any).user; 
  user.fbPageToken = pageData.access_token;
  user.fbPageId = pageData.id;
  user.fbPageName = pageData.name;
  await user.save();

  res.status(200).json({
    success: true,
    pageName: pageData.name 
  });
});

//update token after FB 