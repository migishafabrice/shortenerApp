const argon = require("argon2");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require('dotenv').config();
// JWT Secret keys
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// CSRF protection and cookie parser middlewares are assumed to be set in the app.js or server.js

// Register User
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !password || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if the user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    try {
      const hashedPassword = await argon.hash(password);

      // Save user to the database
      db.query(
        "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)",
        [firstName, lastName, email, hashedPassword],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Error saving data to database" });
          }
          return res.status(201).json({ message: "Registration successful" });
        }
      );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
};

// Login User (Authentication)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Check if the user exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(400).json({ error: "Invalid Email" });
    }

    // Compare password with the stored hash
    const user = result[0];
    const isMatch = await argon.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Password" });
    }

    // Generate Access Token (short expiry)
    const accessToken = jwt.sign(
      { userid: user.id,userFirstname:user.firstname,userLastname:user.lastname, email: user.email },
      SECRET_KEY,
      { expiresIn: "15m" }
    );
    
    // Generate Refresh Token (long expiry)
    const refreshToken = jwt.sign(
      { userid: user.id,userFirstname:user.firstname,userLastname:user.lastname, email: user.email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Store the refresh token in an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set secure cookie in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token in response
    res.json({ accessToken });
  });
};

// Refresh Access Token (using refresh token)
const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userid: decoded.userid,userFirstname: decoded.userFirstname,userLastname:decoded.userLastname,
         email: decoded.email },
      SECRET_KEY,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  });
};

// Example Protected Route (Dashboard)
const dashboard = (req, res) => {
  // Assuming you have a middleware to verify the access token
  res.status(200).json({ message: "Welcome to the dashboard!" });
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  dashboard,
};
