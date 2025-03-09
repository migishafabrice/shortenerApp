// middleware/jwtProtection.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtProtection = (req, res, next) => {
  // Get token from Authorization header
  const token = req.headers['authorization']?.split(' ')[1];  // Format: Bearer <token>
  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: err.message });
    }
    // Attach the decoded user data to the request object for access in the route
    req.user = decoded;
    next();  // Proceed to the next middleware or route handler
  });
};

module.exports = jwtProtection;
