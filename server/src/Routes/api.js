import express from "express";
import profileRoute from '../components/profile/profileController.js';  

const router = express.Router();

router.use("/profile", profileRoute);

export default router;
