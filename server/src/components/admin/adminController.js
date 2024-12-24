import express from "express";
import * as service from "./adminService.js";
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
      res.status(500).json({ message: "An error occur when fetch all games" });
    });
});

// Add new game
router.post("/", upload.array("images"), (req, res) => {
  service
    .addNewProduct(req.body, req.files)
    .then((message) => res.status(200).json(message))
    .catch((err) => {
      console.error("Add new game:", err);
      res.status(500).json({ message: "An error occur when add new game" });
    });
});

// Update game
router.put("/", upload.array("images"), (req, res) => {
  service
    .editProduct(req.body, req.files)
    .then((message) => res.status(200).json(message))
    .catch((err) => {
      console.error("Update game:", err);
      res.status(500).json({ message: "An error occur when update game" });
    });
});

// View game sales analysis
router.get("/sale", (req, res)=>{
  
})

// Remove game
router.delete("/:product_id", (req, res) => {
  const { product_id } = req.params;
  service
    .removeProduct(Number(product_id))
    .then((message) => res.status(200).json(message))
    .catch((err) => {
      console.error(`Remove game ${product_id}:`, err);
      res
        .status(500)
        .json({ message: `An error occur when remove game ${product_id}` });
    });
});

// Display detail product
router.get("/:product_id", (req, res) => {
  const { product_id } = req.params;
  fetchProductByID(Number(product_id))
    .then((products) => res.status(200).json(products))
    .catch((err) => {
      console.error(`Fetch game ${product_id}:`, err);
      res
        .status(500)
        .json({ message: `An error occur when fetch game ${product_id}` });
    });
});

export default router;
