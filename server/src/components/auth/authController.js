import { findUserByEmail, createUser, comparePasswords, generateToken, changeUserPassword, findUserByUsername, decodeJwt, checkMailExist } from './authService.js';
import express from 'express';
import crypto from 'crypto';
import { sendResetEmail } from './sendEmail.js';


const authRouter = express.Router();

// Login route
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    const isMatch = await comparePasswords(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = generateToken(user);

    res.cookie('authToken', token, {
      httpOnly: true,
      sameSite: 'Strict',
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'An error occurred, please try again later.' });
  }
});

// Register route
authRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const checkMail = await checkMailExist(email);
    if (!checkMail) {
      return res.status(400).json({ message: 'Email is invalid.' });
    }
    const userByUsername = await findUserByUsername(username);

    const user = await findUserByEmail(email);

    if (userByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = await createUser({ username, email, password });

    res.status(200).json({ message: 'Registration successful', user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'An error occurred, please try again later.' });
  }
});

// Logout route
authRouter.post("/logout", async (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Logout successful" });
});

// Change password route
authRouter.post("/security", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.cookies.authToken;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Old password and new password are required." });
  }

  try {
    const decoded = await decodeJwt(token);
    const userId = decoded._id;

    const user = await findUserByEmail(decoded.email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await comparePasswords(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    if(oldPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from old password." });
    }

    await changeUserPassword(userId, newPassword);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    res
      .status(500)
      .json({ message: "An error occurred, please try again later." });
  }
});

authRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newPassword = crypto.randomBytes(8).toString("hex");
    await changeUserPassword(user.id, newPassword);
    await sendResetEmail(email, newPassword);

    res
      .status(200)
      .json({ message: "New password sent to your email successfully" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred, please try again later." });
  }
});

authRouter.get("/check-exist-email", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await findUserByEmail(email);
    if (user) {
      return res.status(200).json(true);
    }
    res.status(200).json(false);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred, please try again later.' });
  }
});

authRouter.get("/check-exist-username", async (req, res) => {
  const { username } = req.query;
  try {
    const user = await findUserByUsername(username);
    if (user) {
      return res.status(200).json(true);
    }
    res.status(200).json(false);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred, please try again later.' });
  }
});
// check user is admin
authRouter.get("/check-admin", async (req, res) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ success: false, message: 'You are Unauthorized!' });
  }
  try {
    const decoded = await decodeJwt(token);
    if (decoded.isAdmin === true) {
      return res.status(200).json({success:true,message:'Authorized!'});
    }
    res.status(401).json({ success: false, message: 'You are Unauthorized!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred, please try again later.' });
  }
});

export default authRouter;
