import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';

// Define the shape of the data inside the token
interface TokenPayload {
  userId: string;
  email?: string;
}

// Update function to accept an object (payload) instead of just a string
export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};