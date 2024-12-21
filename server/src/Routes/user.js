


import feedbackController from "../components/user/userController/feedbackController.js";

import express from "express";
const router = express.Router();

router.use("/feedback", feedbackController);
export default router;

