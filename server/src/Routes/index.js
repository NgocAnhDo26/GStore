import profileRoute from "./user.js";
import { authorize } from "../components/auth/verifyRoute.js";
import authController from "../components/auth/authController.js";
import express from "express";
import api from "./api.js";
import admin from "./admin.js";

const router = express.Router();

router.use("/auth", authController);

router.use("/profile", profileRoute);

router.use("/api", api);
router.use("/admin", admin);


router.get("/admin", authorize(true), (req, res) => {
  res.status(200).json({ message: "Welcome Admin!" });
});
router.get("/wishlist", authorize(), (req, res) => {
  res.status(200).json({ message: "Welcome wishlist!" });
});


export default router;
