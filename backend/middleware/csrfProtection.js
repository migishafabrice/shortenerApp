const csrf = require('csurf');

// Create csrfProtection middleware with cookie option
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,   // Ensures that cookies are not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // Ensure cookies are sent only over HTTPS in production
    sameSite: 'Strict',  // Helps prevent CSRF attacks
  }
});

module.exports = csrfProtection;
