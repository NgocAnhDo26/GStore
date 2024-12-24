import { prisma } from '../../../config/config.js';

async function fetchHistoryWithQuery(account_id, query) {
  let filters = { account_id: account_id, status: 'ok' }; // Default filter to include account and status
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  let offset = (page - 1) * limit;

  // Filter by ID (assuming partial match for ID)
  if (query.id) {
    filters.id = { contains: query.id }; // Adjust based on your database schema
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
    filters.created_at = {
      gte: query.from ? new Date(query.from) : undefined,
      lte: query.to ? new Date(query.to) : undefined,
    };
  }

  // Fetch orders and related products
  const history = await prisma.orders.findMany({
    where: filters,
    include: {
      order_product: {
        include: {
          product: true, // Assuming the `order_product` table has a relation to the `product` table
        },
      },
    },
  });

  // Pagination logic
  const paginatedHistory = history.slice(offset, offset + limit);
  const totalPage = Math.ceil(history.length / limit);

  // Map the data to include order details and product IDs
  const mappedHistory = paginatedHistory.map((order) => ({
    order_id: order.id,
    total_price: order.total_price,
    created_at: order.created_at,
    products: order.order_product.map((op) => ({
      product_id: op.product_id,
      product_name: op.product.name, // Assuming `product` has a `name` column
    })),
  }));

  return {
    history: mappedHistory,
    totalPage: totalPage,
    currentPage: page,
  };
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
  }).then((orders) => 
    
    // Calculate the total price for each order
     orders.map((order) => {
      const totalPrice = order.order_products.reduce((sum, orderProduct) => sum + (orderProduct.product.price || 0), 0);

      return {
        id: order.id,
        account_id: order.account_id,
        total_price: totalPrice,
        products: order.order_products.map((orderProduct) => orderProduct.product),
      };
    })
  );
}

export { fetchPurchaseHistory,
          fetchHistoryWithQuery };
