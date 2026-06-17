import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  console.log(`[Auth] Checking token for ${req.method} ${req.originalUrl}`);
  let token = null;

  // 1. Try to extract the token from incoming cookie jars
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    token = cookies['token']; // Reads httpOnly cookie value
  }

  // 2. Fallback: Try to extract token from standard Authorization headers
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
  }

  if (!token) {
    console.log(`[Auth] Denied: Token missing for ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ error: "Access denied. Token missing from request cookies or authentication header." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      console.log(`[Auth] Denied: Token invalid for ${req.method} ${req.originalUrl}`);
      return res.status(403).json({ error: "Access forbidden. Token is invalid or expired." });
    }
    
    req.user = decodedUser; // Appends active token payload safely to request downstream
    next();
  });
};
