import express, { response } from "express";
import * as service from "./gameService.js";

const router = express.Router();

router.get("/", (req, res) => {
  // if there is no query and no params, just query feature products and best sellers products
  if (Object.keys(req.query).length === 0) {
    const result = {};
    service
      .fetchFeatureProducts()
      .then((featureProducts) => {
        result.featureProducts = featureProducts;
        service
          .fetchBestSellersProducts()
          .then((bestSellersProducts) => {
            result.bestSellersProducts = bestSellersProducts;
            return res.status(200).json(result);
          })
          .catch((err) => {
            console.error("Fetch best sellers products error:", err);
            return res.status(500).json({
              message: "An error occur when fetching best sellers products",
            });
          });
      })
      .catch((err) => {
        console.error("Fetch feature products error:", err);
        return res
          .status(500)
          .json({ message: "An error occur when fetching feature products" });
      });
  } else {
    // find products by query
    service
      .fetchProductWithQuery(req.params, req.query)
      .then((products) => {
        return res.status(200).json(products);
      })
      .catch((err) => {
        console.error("Fetch products by category error:", err);
        return res.status(500).json({
          message: "An error occur when fetching products by category",
        });
      });
  }
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
