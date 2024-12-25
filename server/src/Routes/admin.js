import adminController from "../components/admin/adminController.js";
import adminFeedbackController from "../components/admin/feedbackController.js";
import express from "express";
const router = express.Router();

router.use("/product", adminController);
router.use("/feedback", adminFeedbackController);

export default router;
