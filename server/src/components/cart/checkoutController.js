
import { checkoutService ,decodeJwt} from './checkoutService.js';
import express from 'express';

const cartRouter = express.Router();
cartRouter.post("/", async (req, res) => {
  try {

    const token = req.cookies.authToken;

    const decoded = await decodeJwt(token);
    
    const order = await checkoutService({accountId:  decoded._id});
    return res.status(200).json({
      message: 'Checkout successful',
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
});

export default cartRouter;