import express from "express";
import * as service from "./game_keyService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await service.getAllProductsWithKeys();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  const { productId, keyCode } = req.body;

  if (!productId || !keyCode) {
    return res.status(400).json({ message: "Missing required fields: productId and keyCode" });
  }

  try {
    const newKey = await service.addGameKey(productId, keyCode);
    return res.status(201).json({
      message: "Game key added successfully",
      gameKey: newKey,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
