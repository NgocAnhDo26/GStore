import express from "express";
import * as collectionService from "../components/user/userService/collectionService.js";
import * as historyService from "../components/user/userService/historyService.js";
import * as reviewService from "../components/user/userService/reviewService.js";
import * as wishlistService from "../components/user/userService/wishlistService.js";
import gameController from "../components/game/gameController.js";
import cartController from "../components/cart/cartController.js";
import { authorize } from "../components/auth/verifyRoute.js";

const router = express.Router();

router.use("/product", gameController);

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
