import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extracts token from "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing from Authorization header." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ error: "Access forbidden. Token is invalid or expired." });
    }
    
    req.user = decodedUser; // Appends active token payload to the request object
    next();
  });
};