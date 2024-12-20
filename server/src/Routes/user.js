import * as accountController from "../components/user/userController/accountController.js";
import * as collectionController from "../components/user/userController/collectionController.js";
import * as reviewController from "../components/user/userController/reviewController.js";
import * as historyController from "../components/user/userController/historyController.js";
import * as wishlistController from "../components/user/userController/wishlistController.js";
import { authorize } from "../components/auth/verifyRoute.js";
import express from "express";

const router = express.Router();

router.get("/info", authorize(), accountController.getUserInfo);
router.post("/info", authorize(), accountController.updateUserInfo);

router.get(
  "/collection",
  authorize(),
  collectionController.getUserGameCollection,
);

router.get("/history", authorize(), historyController.getPurchaseHistory);

router.get("/review", authorize(), reviewController.getUserReview);

router.get("/wishlist", authorize(), wishlistController.getUserWishlist);

export default router;
