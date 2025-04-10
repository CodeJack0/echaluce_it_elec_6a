const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken
const User = require("../models/user");

// Signup Route (Already Implemented)
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: "User created!",
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Invalid authentication credentials!"
      });
    });
});

// Login Route
router.post("/login", (req, res, next) => {
  let fetchedUser;

  // Step 1: Find user by email
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        // If user not found, send an error
        return res.status(401).json({ message: "Auth failed: Email not found" });
      }

      fetchedUser = user; // Store the found user for later use
      return bcrypt.compare(req.body.password, user.password); // Step 2: Compare the password
    })
    .then(result => {
      if (!result) {
        // If password doesn't match, send an error
        return res.status(401).json({ message: "Auth failed: Incorrect password" });
      }

      // Step 3: Generate JWT token
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id }, // Payload: user details
        "A_very_long_string_for_our_secret", // Secret key (ideally should be stored in environment variables)
        { expiresIn: "1h" } // Token expiration time (1 hour)
      );

      // Step 4: Send token, expiration time, and userId in the response
      res.status(200).json({
        token: token, // The generated token
        expiresIn: 3600, // Token expiration time (in seconds)
        userId: fetchedUser._id // User's unique ID
      });
    })
    .catch(err => {
      // If an error occurs during the process, return a generic error response
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

module.exports = router;
