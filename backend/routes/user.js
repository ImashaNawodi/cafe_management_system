const express = require("express");
const connection = require("../connection");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
require("dotenv").config();
const auth = require('../services/authentication');
const checkRole = require("../services/checkRole");

router.post("/signup", (req, res) => {
  let user = req.body;
  let query = "SELECT email, password, role, status FROM user WHERE email = ?";

  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query = "INSERT INTO user (name, contactNumber, email, password, status, role) VALUES (?, ?, ?, ?, 'false', 'user')";
        connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
          if (!err) {
            return res.status(200).json({ message: "Successfully Registered" });
          } else {
            return res.status(500).json(err);
          }
        });
      } else {
        return res.status(400).json({ message: "Email already exists." });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.post("/login", (req, res) => {
  const user = req.body;
  const query = "SELECT email, password, role, status FROM user WHERE email = ?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password !== user.password) {
        return res.status(401).json({ message: "Incorrect username or password" });
      } else if (results[0].status === "false") {
        return res.status(401).json({ message: "Wait for admin approval" });
      } else {
        const response = { email: results[0].email, role: results[0].role };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: "8h" });
        return res.status(200).json({ token: accessToken });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

router.post('/forgotPassword', (req, res) => {
  const user = req.body;
  const query = "SELECT email, password FROM user WHERE email = ?";

  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(400).json({ message: "Email not found." });
      } else {
        const mailOptions = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: "Password by cafe management system",
          html: `
            <p>
              <b>Your login details for cafe management system</b><br>
              <b>Email:</b> ${results[0].email}<br>
              <b>Password:</b> ${results[0].password}<br>
              <a href="http://localhost:4200">Click here to login</a>
            </p>
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ message: "Error sending email.", error });
          } else {
            console.log("Email sent: " + info.response);
            return res.status(200).json({ message: "Password sent successfully to your email." });
          }
        });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
  const query = "SELECT id, name, email, contactNumber, status FROM user WHERE role='user'";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
  const user = req.body;
  const query = "UPDATE user SET status=? WHERE id=?";
  connection.query(query, [user.status, user.id], (err, results) => {
    if (!err) {
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User id does not exist" });
      }
      return res.status(200).json({ message: "Updated successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get('/checkToken', auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: "true" });
});

router.post('/changePassword', auth.authenticateToken, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const email = res.locals.email;
    
    // Check if newPassword is provided
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }
  
    const query = "SELECT * FROM user WHERE email=? AND password=?";
    connection.query(query, [email, oldPassword], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      
      if (results.length === 0) {
        return res.status(400).json({ message: "Incorrect old password" });
      }
      
      const updateQuery = "UPDATE user SET password=? WHERE email=?";
      connection.query(updateQuery, [newPassword, email], (err, updateResults) => {
        if (err) {
          return res.status(500).json({ message: "Database error", error: err });
        }
        
        return res.status(200).json({ message: "Password updated successfully" });
      });
    });
  });

module.exports = router;


