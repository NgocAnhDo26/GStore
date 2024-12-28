
import { checkoutService ,decodeJwt,getCartItems} from './checkoutService.js';
import express from 'express';

const cartRouter = express.Router();
cartRouter.post("/", async (req, res) => {
  const { paymentMethodId } = req.body;
  if(!paymentMethodId){
    return res.status(400).json({ error: 'Payment method is required' });
  }
  try {

    const token = req.cookies.authToken;

    const decoded = await decodeJwt(token);
    
    const order = await checkoutService({accountId:  decoded._id, paymentMethodId});
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
cartRouter.get("/", async (req, res) => {
  try {
    const token = req.cookies.authToken;
    const decoded = await decodeJwt(token);
    const cartItems = await getCartItems({accountId:decoded._id});
    return res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
});

export default cartRouter;