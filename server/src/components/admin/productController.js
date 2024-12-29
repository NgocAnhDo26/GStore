import express from "express";
import * as service from "./productService.js";
import {
  fetchProductWithQuery,
  fetchProductByID,
} from "../game/gameService.js";
import { upload } from "../../config/config.js";

const router = express.Router();

// Fetch all current games
router.get("/", (req, res) => {
  fetchProductWithQuery(req.query)
    .then((products) => res.status(200).json(products))
    .catch((err) => {
      console.error("Fetch all games:", err);
      return res.status(500).json({ message: err.message });
    });
});

// Add new game
router.post("/", upload.array("images"), (req, res) => {
  service
    .addNewProduct(req.body, req.files)
    .then((message) => res.status(200).json(message))
    .catch((err) => {
      console.error("Add new game:", err);
      return res.status(500).json({ message: err.message });
    });
});

// Update game
router.put("/", upload.array("images"), (req, res) => {
  service
    .editProduct(req.body, req.files)
    .then((message) => res.status(200).json(message))
    .catch((err) => {
      console.error("Update game:", err);
      return res.status(500).json({ message: err.message });
    });
});

// View game sales analysis
router.get("/sale", (req, res) => {
  service
    .viewGameSales(req.query)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.error(`View game sale:`, err);
      return res.status(500).json({ message: err.message });
    });
});

// Remove game
router.delete("/:productID", (req, res) => {
  const { productID } = req.params;
  service
    .removeProduct(Number(productID))
    .then((message) => res.status(200).json(message))
    .catch((err) => {
      console.error(`Remove game ${productID}:`, err);
      return res.status(500).json({ message: err.message });
    });
});

// Display detail product
router.get("/:productID", (req, res) => {
  const { productID } = req.params;
  fetchProductByID(Number(productID))
    .then((products) => res.status(200).json(products))
    .catch((err) => {
      console.error(`Fetch game ${productID}:`, err);
      return res.status(500).json({ message: err.message });
    });
});

export default router;
