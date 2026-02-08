import { Request, Response } from "express";
import { generateToken } from "../../common/utils/jwt";
import User from "../../models/user.model";
import bcrypt from "bcryptjs";

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

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }


    const token = generateToken({
        userId: user.id,
        email: user.email,
    });

    res.json({
        token,
    });
};
