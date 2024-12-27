import express from "express";
import * as service from "./cartService.js";

const router = express.Router();

// Fetch games in cart by accountID
router.get("/", (req, res) => {
  const { id } = req.user;
  service
    .fetchAllGames(id)
    .then((games) => res.status(200).json(games))
    .catch((err) => {
      console.error("Fetch cart games:", err);
      return res.status(500).json({ message: err.message });
    });
});

// Add new game to cart
router.post("/", (req, res) => {
  const { id } = req.user;
  service
    .addNewGame(id, req.body)
    .then((game) => res.status(200).json(game))
    .catch((err) => {
      console.error("Add new game:", err);
      return res.status(500).json({ message: err.message });
    });
});

// Remove game from cart
router.delete("/:productID", (req, res) => {
  const { id } = req.user;
  service
    .removeGame(Number(id), req.params)
    .then((game) => res.status(200).json(game))
    .catch((err) => {
      console.error("Remove game:", err);
      return res.status(500).json({ message: err.message });
    });
});

// Update game quantity
router.put("/", (req, res) => {
  const { id } = req.user;
  service
    .updateGame(id, req.body)
    .then((game) => res.status(200).json(game))
    .catch((err) => {
      console.error("Update game:", err);
      return res.status(500).json({ message: err.message });
    });
});
export default router;
