import express from "express";
import * as service from "./gameService.js";

const router = express.Router();

// route for query product
router.get("/", (req, res) => {
  service
    .fetchProductWithQuery(req.params, req.query)
    .then((products) => {
      return res.status(200).json(products);
    })
    .catch((err) => {
      console.error("Fetch products by query:", err);
      return res.status(500).json({
        message: "An error occur when fetching products by query",
      });
    });
});

// best sellers, hot games
router.get("/bestseller", (req, res) => {
  service
    .fetchBestSellersProducts()
    .then((bestSellersProducts) => {
      return res.status(200).json(bestSellersProducts);
    })
    .catch((err) => {
      console.error("Fetch best sellers products error:", err);
      return res.status(500).json({
        message: "An error occur when fetching best sellers products",
      });
    });
});

router.get("/feature-product", (req, res) => {
  service
    .fetchFeatureProducts()
    .then((featureProducts) => {
      return res.status(200).json(featureProducts);
    })
    .catch((err) => {
      console.error("Fetch feature products error:", err);
      return res
        .status(500)
        .json({ message: "An error occur when fetching feature products" });
    });
});

router.get("/:product_id", (req, res) => {
  // find products by product id
  service
    .fetchProductByID(req.params.product_id)
    .then((singleProduct) => {
      res.status(200).json(singleProduct);
    })
    .catch((err) => {
      console.error("Fetch product by id error:", err);
      res
        .status(500)
        .json({ message: "An error occur when fetching product by id" });
    });
});

export default router;
