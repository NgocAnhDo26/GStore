import { authorize } from "../auth/verifyRoute.js";
import authController from "../auth/authController.js";
import express from "express";

const router = express.Router();

router.use("/auth", authController);

router.get("/admin", authorize(true), (req, res) => {
  res.status(200).json({ message: "Welcome Admin!" });
});

router.get("/profile", authorize(), (req, res) => {
  res.status(200).json({ message: "Welcome User!", user: req.user });
});

export default router;
