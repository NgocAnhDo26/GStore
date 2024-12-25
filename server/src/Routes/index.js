import profileRoute from "./user.js";
import { authorize } from "../components/auth/verifyRoute.js";
import authController from "../components/auth/authController.js"; 
import express from "express";
import api from "./api.js";
import adminRoute from "./admin.js";

const router = express.Router();

router.use("/auth", authController);

router.use("/admin", authorize(true), adminRoute);

router.use("/profile", profileRoute);

router.use("/api", api);

export default router;
