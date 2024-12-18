import { prisma } from '../../../config/config.js';

// Function to fetch purchase history with filters (query)
async function fetchHistoryWithQuery(account_id, query) {
  let filters = { account_id: account_id };
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  let offset = (page - 1) * limit;

  // Filter by ID resemblance
  if (query.id) {
      filters.id = { contains: query.id }; // Assumes resemblance means partial match
  }

  // Filter by minimum and maximum total price
  if (query.min || query.max) {
      filters.total_price = {
          gte: query.min ? Number(query.min) : 0,
          lte: query.max ? Number(query.max) : Number.MAX_SAFE_INTEGER,
      };
  }

  // Filter by time range
  if (query.from || query.to) {
      filters.timestamp = {
          gte: query.from ? new Date(query.from) : undefined,
          lte: query.to ? new Date(query.to) : undefined,
      };
  }

  // Fetch data from database
  const history = await prisma.purchase_history.findMany({
      include: {
          account: true,
          items: true, // Assumes there is a related `items` table
      },
      where: filters,
  });

  // Pagination logic
  let paginatedHistory = history.slice(offset, offset + limit);
  let totalPage = Math.ceil(history.length / limit);

  return { history: paginatedHistory, totalPage: totalPage, currentPage: page };
}

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

export { fetchPurchaseHistory,
          fetchHistoryWithQuery };
