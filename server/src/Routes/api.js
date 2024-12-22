import purchaseController from "../components/cart/purchaseController.js"
import wishlistController from "../components/wishlist/wishlistController.js"
import reviewController from "../components/review/reviewController.js";
import profileRoute from '../components/profile/profileController.js'; 

import express from "express";

const router = express.Router();

router.use("/profile", profileRoute);
router.use("/wishlist",wishlistController);
router.use("/review",reviewController);
router.use("/checkout",purchaseController);
export default router;

