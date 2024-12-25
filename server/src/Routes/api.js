import purchaseController from "../components/cart/purchaseController.js"
import wishlistController from "../components/wishlist/wishlistController.js"
import reviewController from "../components/review/reviewController.js";
import profileRoute from '../components/profile/profileController.js'; 
import gameController from "../components/game/gameController.js";
import cartController from "../components/cart/cartController.js";
import { authorize } from "../components/auth/verifyRoute.js";
import express from "express";

const router = express.Router();

router.use("/profile", profileRoute);
router.use("/product", gameController);
router.use("/review",reviewController);
router.use("/checkout",purchaseController);
router.use("/cart", authorize(), cartController);

router.get("/history", (req, res) => {
  historyService
    .fetchHistoryWithQuery(req.user.id, req.query)
    .then((result) => {
      res.json(result);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json(e);
    });
});

export default router;
