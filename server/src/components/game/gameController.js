import express from "express";
import * as service from "./gameService.js";

const router = express.Router();

// Route for query product
router.get("/", (req, res) => {
  service
    .fetchProductWithQuery(req.query)
    .then((products) => res.status(200).json(products))
    .catch((err) => {
      console.error("Fetch games by query:", err);
      return res.status(500).json({
        message: "An error occur when fetching games by query",
      });
    });
});

// Best sellers, hot games
router.get("/bestseller", (req, res) => {
  service
    .fetchBestSellersProducts()
    .then((bestSellersProducts) => res.status(200).json(bestSellersProducts))
    .catch((err) => {
      console.error("Fetch best sellers games error:", err);
      return res.status(500).json({
        message: "An error occur when fetching best sellers games",
      });
    });
});

router.get("/feature-product", (req, res) => {
  service
    .fetchFeatureProducts()
    .then((featureProducts) => res.status(200).json(featureProducts))
    .catch((err) => {
      console.error("Fetch feature games error:", err);
      return res
        .status(500)
        .json({ message: "An error occur when fetching feature games" });
    });
});

// Fetch categories and number of games in each category
router.get("/category", (req, res) => {
  service
    .fetchCategories()
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((err) => {
      console.error("Fetch categories error:", err);
      res
        .status(500)
        .json({ message: "An error occur when fetching categories" });
    });
});

router.get("/list-productID", (req, res) => {
  // Find products by list of product id
  service
    .fetchProductByListID(req.body)
    .then((singleProduct) => {
      res.status(200).json(singleProduct);
    })
    .catch((err) => {
      console.error("Fetch games by list of id error:", err);
      res
        .status(500)
        .json({ message: "An error occur when fetching game by list of id" });
    });
});

router.get("/:product_id", (req, res) => {
  // Find products by product id
  service
    .fetchProductByID(Number(req.params.product_id))
    .then((singleProduct) => {
      res.status(200).json(singleProduct);
    })
    .catch((err) => {
      console.error("Fetch game by id error:", err);
      res
        .status(500)
        .json({ message: "An error occur when fetching game by id" });
    });
});

export default router;
