import adminController from "../components/admin/adminController.js";
import adminFeedbackController from "../components/admin/feedbackController.js";
import gamekeyController from "../components/admin/game_keyController.js";
import express from "express";
const router = express.Router();

router.use("/product", adminController);
router.use("/feedback", adminFeedbackController);
router.use("/game-key", gamekeyController);

export default router;
