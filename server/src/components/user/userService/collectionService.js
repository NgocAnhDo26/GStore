import { prisma } from '../../../config/config.js';

async function fetchGameCollection(accountId) {
    const collection = await prisma.product.findMany({
      where: {
        order_products: {
          some: {
            order: {
              account_id: accountId,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
      },
    });
    return collection;
  }
  
  export { fetchGameCollection };