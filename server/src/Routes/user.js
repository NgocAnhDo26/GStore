import feedbackController from "../components/user/userController/feedbackController.js";
import { authorize } from "../components/auth/verifyRoute.js";
import express from "express";

const router = express.Router();

router.use("/feedback", authorize(), feedbackController);

export default router;
