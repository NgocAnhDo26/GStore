import profileRoute from '../components/profile/profileController.js';  
import { authorize } from "../components/auth/verifyRoute.js";
import authController from "../components/auth/authController.js";
import express from "express";
import api from "./api.js";

const router = express.Router();

router.use("/auth", authController);

router.get("/admin", authorize(true), (req, res) => {
  res.status(200).json({ message: "Welcome Admin!" });
});

router.use("/profile", profileRoute);

router.use("/api", api);

export default router;
