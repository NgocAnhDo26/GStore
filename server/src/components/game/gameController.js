import * as service from "./gameService.js";
import express from "express";
const router = express.Router();
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
  export default router;