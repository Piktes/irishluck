import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'irish-luck-jwt-secret-tepe-prime-2026';

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
