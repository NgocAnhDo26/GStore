import express from "express";
import gameController from "../game/gameController.js";

const router = express.Router();

router.use("/", gameController);

export default router;
