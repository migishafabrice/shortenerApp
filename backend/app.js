const express = require('express');
const cors = require('cors');
const corsOptions = require('./middleware/corsOptions');
const csrfProtection = require('./middleware/csrfProtection');
const jwtProtection = require('./middleware/jwtProtection');  // Import the JWT protection middleware
const authRoutes = require('./routes/authRoutes');
const urlRoutes=require('./routes/urlRoutes');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
// Define rate limiting rules
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  headers: true,
});
// Middleware setup
app.use(express.json());        // Parse JSON request bodies
app.use(cookieParser());        // Parse cookies (for CSRF token)
app.use(cors(corsOptions));     // CORS configuration
app.use(csrfProtection);        // CSRF protection middleware

// CSRF token endpoint for frontend to get token
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });  // Send CSRF token to frontend
});

// Authentication Routes (register, login, etc.)
app.use('/auth', authRoutes,rateLimit);  // This handles both registration and login routes
app.use('/short-url',urlRoutes,rateLimit); // URL Shortening routes
// Protected route (e.g., Dashboard)
app.get('/user', jwtProtection, (req, res) => {
  res.json({ message: 'Welcome to the dashboard', user: req.user });  // You can access user data from req.user
});
app.get('/urls', jwtProtection, (req, res) => {
  res.json({ message: 'Welcome to the dashboard', user: req.user });  // You can access user data from req.user
});
// Error handling for CSRF token errors
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'CSRF token mismatch' });
  }
  next(err);  // Pass errors to the next handler
});
// General error handling for all routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
