import purchaseController from "../components/cart/purchaseController.js"
import wishlistController from "../components/wishlist/wishlistController.js"
import reviewController from "../components/review/reviewController.js";
import gameController from "../components/game/gameController.js";


import cartController from "../components/cart/cartController.js";
import { authorize } from "../components/auth/verifyRoute.js";
import express from "express";
const router = express.Router();

router.use("/product", gameController);
router.use("/wishlist",wishlistController);
router.use("/review",reviewController);
router.use("/checkout",purchaseController);
router.use("/cart", authorize(), cartController);



export default router;
