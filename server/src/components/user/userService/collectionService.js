import { prisma } from '../../../config/config.js';

async function fetchGameCollectionWithQuery(account_id, query) {
  try {
    // Base filter for orders
    const orderFilter = {
      account_id,
      status: "ok", // Filter by status 'ok'
    };

    // Pagination setup
    const page = Number(query.page) || 1; // Default to page 1 if not provided
    const limit = Number(query.limit) || 10; // Default to 10 items per page if not provided
    const offset = (page - 1) * limit; // Calculate the offset for pagination

    // Keyword filter (optional)
    const keywordFilters = [];
    if (query.keyword) {
      keywordFilters.push({
        product: {
          name: { contains: query.keyword },
        },
      });
    }

    // Date range filter (optional)
    if (query.from && query.to) {
      orderFilter.create_time = {
        gte: new Date(query.from), // Greater than or equal to 'from' date
        lte: new Date(query.to),   // Less than or equal to 'to' date
      };
    }

    // Query orders and related order_products with pagination
    const gameCollection = await prisma.orders.findMany({
      where: orderFilter,
      include: {
        order_product: {
          include: {
            product: true, // Assuming a relation to the product table for game details
          },
          where: keywordFilters.length > 0 ? { OR: keywordFilters } : undefined,
        },
      },
      skip: offset, // Skip records for pagination
      take: limit,  // Limit the number of records per page
    });

    // Fetch total count for pagination calculation
    const totalCount = await prisma.orders.count({
      where: orderFilter,
    });

    // Flatten the results to extract game information
    const games = gameCollection.flatMap(order =>
      order.order_product.map(orderProduct => orderProduct.product)
    );

    // Calculate total pages
    const totalPage = Math.ceil(totalCount / limit);

    return {
      games,
      currentPage: page,
      totalPage: totalPage,
    };
  } catch (error) {
    console.error("Error fetching game collection:", error);
    throw new Error("Failed to fetch game collection.");
  }
}




async function fetchGameCollection(account_id) {
    const collection = await prisma.product.findMany({
      where: {
        order_products: {
          some: {
            order: {
              account_id: account_id,
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
  
export { 
  fetchGameCollection, 
  fetchGameCollectionWithQuery
};