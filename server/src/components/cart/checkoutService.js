import { prisma } from '../../config/config.js';
import jwt from 'jsonwebtoken';

async function decodeJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}

async function checkoutService({accountId}) {

  return prisma.$transaction(async (prisma) => {
   
    const order = await prisma.orders.create({
      data: {
        account_id: parseInt(accountId,10),
        status: 'Pending',
      },
    });

  
    const cartItems = await prisma.cart.findMany({
      where: { account_id: accountId },
    });

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

  
    const orderProducts = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    await prisma.order_product.createMany({
      data: orderProducts,
    });

  
    await prisma.cart.deleteMany({
      where: { account_id: accountId },
    });

    return order;
  });
};
export { decodeJwt, checkoutService };