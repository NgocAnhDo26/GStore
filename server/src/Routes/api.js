import express from "express";
import gameController from "../components/game/gameController.js";

const router = express.Router();

router.use("/product", gameController);

export default router;
