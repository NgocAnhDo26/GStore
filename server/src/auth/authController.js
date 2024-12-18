import crypto from "crypto";
import { sendResetEmail } from "./sendEmail.js";
import express from "express";
import { login, register } from "./authService.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  login(req.body)
    .then((result) => {
      if (Object.keys(result).length < 4) {
        const { message, status } = result;
        return res.status(status).json({ message: message });
      }
      const { message, token, user, status } = result;
      return res.status(status).json({ message, token, user });
    })
    .catch((err) => {
      console.error("Registration error:", err);
      res
        .status(500)
        .json({ message: "An error occurred, please try again later." });
    });
});

router.post("/register", async (req, res) => {
  register(req.body)
    .then((result) => {
      if (Object.keys(result).length < 4) {
        const { message, status } = result;
        return res.status(status).json({ message: message });
      }
      const { message, token, user, status } = result;
      return res.status(status).json({ message, token, user });
    })
    .catch((err) => {
      console.error("Registration error:", err);
      res
        .status(500)
        .json({ message: "An error occurred, please try again later." });
    });
});

router.post("/logout", async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  try {
    await prisma.token.delete({
      where: {
        token: token,
      },
    });

    resstatus(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res
      .status(500)
      .json({ message: "An error occurred, please try again later." });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.account.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPassword = crypto.randomBytes(8).toString("hex");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.account.update({
      where: { email },
      data: { password: hashedPassword },
    });

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

async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Old password and new password are required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded._id;

    const user = await prisma.account.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.account.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    resstatus(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    res
      .status(500)
      .json({ message: "An error occurred, please try again later." });
  }
}

export default router;
