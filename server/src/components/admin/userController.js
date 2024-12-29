import express from "express";
import * as service from "./userService.js";

const router = express.Router();

// Fetch all accounts
router.get("/", (req, res) => {
  service
    .fetchAccountWithQuery(req.query)
    .then((accounts) => res.status(200).json(accounts))
    .catch((err) => {
      console.error("Fetch all accounts:", err);
      return res.status(500).json({ message: err.message });
    });
});

// Add new account
router.post("/", (req, res) => {
  service
    .addNewAccount(req.body)
    .then((message) => res.status(200).json(message))
    .catch((err) => {
      console.error("Add new account:", err);
      return res.status(500).json({ message: err.message });
    });
});

// Update account
router.put("/", (req, res) => {
  service
    .editAccount(req.body)
    .then((message) => res.status(200).json(message))
    .catch((err) => {
      console.error("Update account:", err);
      return res.status(500).json({ message: err.message });
    });
});

// Remove game
router.delete("/:accountID", (req, res) => {
  const { accountID } = req.params;
  service
    .removeProduct(Number(accountID))
    .then((message) => res.status(200).json(message))
    .catch((err) => {
      console.error(`Remove game ${accountID}:`, err);
      return res.status(500).json({ message: err.message });
    });
});

// Display detail account
router.get("/:accountID", (req, res) => {
  const { accountID } = req.params;
  service
    .fetchAccountByID(Number(accountID))
    .then((products) => res.status(200).json(products))
    .catch((err) => {
      console.error(`Fetch game ${accountID}:`, err);
      return res.status(500).json({ message: err.message });
    });
});

export default router;
