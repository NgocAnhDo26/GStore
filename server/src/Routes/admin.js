import productController from "../components/admin/productController.js";
import adminFeedbackController from "../components/admin/feedbackController.js";
import gamekeyController from "../components/admin/game_keyController.js";
import userController from "../components/admin/userController.js";
import express from "express";
const router = express.Router();

router.use("/product", productController);
router.use("/feedback", adminFeedbackController);
router.use("/game-key", gamekeyController);
router.use("/user", userController);

export default router;
