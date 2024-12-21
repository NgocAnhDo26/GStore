import express from "express";
import * as service from "./cartService.js";

const router = express.Router();

// get cart items base on account_id
router.get("/:account_id", (req, res) => {
  service
    .fetchAllItems(Number(req.params.account_id))
    .then((items) => {
      return res.status(200).json(items);
    })
    .catch((err) => {
      console.error("Fetch cart items:", err);
      return res
        .status(500)
        .json({ message: "An error occur when fetching cart items" });
    });
});

// add new item to cart
router.post("/:account_id/item/:product_id", (req, res) => {
  service
    .addNewItem(req.params)
    .then((item) => {
      if (item.message) {
        return res.status(400).json(item);
      }
      return res.status(200).json(item);
    })
    .catch((err) => {
      console.error("add new item:", err);
      return res
        .status(500)
        .json({ message: "An error occur when adding new item" });
    });
});

// remove item from cart
router.delete("/:account_id/item/:product_id", (req, res) => {
  service
    .removeItem(req.params)
    .then((item) => {
      if (item.message) {
        return res.status(400).json(item);
      }
      return res.status(200).json(item);
    })
    .catch((err) => {
      console.error("remove item:", err);
      return res
        .status(500)
        .json({ message: "An error occur when removing cart item" });
    });
});

// update item quantity
router.put("/", (req, res) => {
  service
    .updateItem(req.body)
    .then((item) => {
      if (item.message) {
        return res.status(400).json(item);
      }
      return res.status(200).json(item);
    })
    .catch((err) => {
      console.error("update item:", err);
      return res
        .status(500)
        .json({ message: "An error occur when updating cart item" });
    });
});
export default router;
