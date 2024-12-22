import express from "express";
import adminController from "../components/admin/adminController.js";

const router = express.Router();

router.use("/product", adminController);

export default router;
