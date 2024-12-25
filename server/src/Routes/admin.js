import adminController from "../components/admin/feedbackController.js";

import express from "express";

const router = express.Router();

router.use("/feedback", adminController);
export default router;