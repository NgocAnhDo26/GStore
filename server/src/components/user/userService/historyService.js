import { prisma } from '../../../config/config.js';

async function fetchPurchaseHistory(accountId) {
  return prisma.orders.findMany({
    where: {
      account_id: accountId,
    },
    select: {
      id: true,
      account_id: true,
      order_products: {
        select: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    },
  }).then((orders) => {
    
    // Calculate the total price for each order
    return orders.map((order) => {
      const totalPrice = order.order_products.reduce((sum, orderProduct) => {
        return sum + (orderProduct.product.price || 0);
      }, 0);

      return {
        id: order.id,
        account_id: order.account_id,
        total_price: totalPrice,
        products: order.order_products.map((orderProduct) => orderProduct.product),
      };
    });
  });
}

export { fetchPurchaseHistory };
