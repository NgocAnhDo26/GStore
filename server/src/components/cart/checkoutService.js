import { prisma } from '../../config/config.js';
import jwt from 'jsonwebtoken';
import sgMail from "@sendgrid/mail";
import { getImage } from "../util/util.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendKeyGame(keysToSend, email) {
  const keyCodes = keysToSend.map(item => 
    `<p>Product Name: ${item.product_name}  - Key Code: ${item.key_code}</p>`
  ).join('');

  const msg = {
    to: email,
    from: {
      email: "phamhoangkha14032004@gmail.com",
      name: "GStore",
    },
    subject: "Your Game Keys from GStore",
    html: `<h3>Thank you for your purchase! Here are your game keys:</h3>${keyCodes}`,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}


async function decodeJwt(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
}

async function checkoutService({ accountId, paymentMethodId }) {
  await prisma.$transaction(async (prisma) => {

    const order = await prisma.orders.create({
      data: {
        account_id: parseInt(accountId, 10),
        payment_method_id: parseInt(paymentMethodId, 10),
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

    const keysToSend = [];

    for (const item of cartItems) {
      for (let i = 0; i < item.quantity; i++) {
        const keyGame = await prisma.key_game.findFirst({
          where: {
            product_id: item.product_id,
            is_used: false,
          },
        });

        if (!keyGame) {
          throw new Error(`No available key for product id ${item.product_id}`);
        }

        const product = await prisma.product.findUnique({
          where: { id: item.product_id },
          select: { name: true },
        });

        await prisma.key_game.update({
          where: { id: keyGame.id },
          data: { is_used: true },
        });

        keysToSend.push({
          product_id: item.product_id,
          key_code: keyGame.key_code,
          product_name: product.name,
        });

        await prisma.product.update({
          where: { id: item.product_id },
          data: { in_stock: { decrement: 1 } },
        });
      }
    }

    await prisma.cart.deleteMany({
      where: { account_id: accountId },
    });

    const emailRecord = await prisma.account.findUnique({
      where: { id: accountId },
      select: {
        email: true,
      },
    });
    const email = emailRecord.email;

    await sendKeyGame(keysToSend, email);

    await prisma.orders.update({
      where: { id: order.id },
      data: { status: 'Completed' },
    });

    return { order };
  }, { timeout: 10000 });
}
async function getCartItems({ accountId }) {
  const cartItems = await prisma.cart.findMany({
    where: { account_id: parseInt(accountId, 10) },
    include: {
      product: {
        select: {
          name: true,
          price: true,
          product_image: {
            where: { is_profile_img: true },
            select: { public_id: true },
          },
        },
      },
    },
  });

  const paymentMethods = await prisma.payment_methods.findMany({
    select: { id: true, method_name: true },
  });

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );


  return {
    cartItems: cartItems.map((item) => ({
      product_id: item.product_id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      image_url: getImage(item.product.product_image[0]?.public_id).url || null, 
    })),
    paymentMethods,
    totalAmount,
  };
}


export { decodeJwt, checkoutService, getCartItems };
