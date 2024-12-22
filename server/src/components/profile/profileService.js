import { prisma } from '../../config/config.js';
import jwt from 'jsonwebtoken';

async function fetchAccountByID(accountID) {
    console.log('Fetching account with ID:', accountID);

    const account = await prisma.account.findUnique({
        where: { id: accountID },
        select: {
            id: true,
            username: true,
            email: true,
            address: true,
            birthdate: true,
            create_time: true,
        }
    });

    console.log('Account found:', account);
    return account;
};

async function updateAccountByID(accountID, updateFields) {
  console.log('Updating account with ID:', accountID);

  // Filter out undefined fields dynamically
  const dataToUpdate = {};
  if (updateFields.username) dataToUpdate.username = { set: updateFields.username };
  if (updateFields.birthdate) dataToUpdate.birthdate = new Date(updateFields.birthdate);
  if (updateFields.phone) dataToUpdate.phone = updateFields.phone;

  try {
      const updatedUser = await prisma.account.update({
          where: {
              id: accountID,
          },
          data: dataToUpdate,
      });

      console.log('Account updated:', updatedUser);
      return updatedUser;
  } catch (error) {
      console.error('Error updating account:', error);
      throw new Error('Failed to update account.');
  }
}


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

async function fetchUserReviewWithQuery(account_id, query) {
    const filters = {
        account_id: account_id,
    };

    // Filter by content
    if (query.content) {
        filters.content = {
        contains: query.content, // Assumes a partial match on content
        mode: 'insensitive', // Case insensitive search
        };
    }

    // Filter by product name (game name)
    if (query.game_name) {
        filters.product = {
        name: {
            contains: query.game_name, // Partial match on game name
            mode: 'insensitive', // Case insensitive search
        },
        };
    }

    // Filter by rating
    if (query.rating) {
        filters.rating = {
        gte: Number(query.rating), // Assuming an exact match for rating
        };
    }

    // Filter by date range (from, to)
    if (query.from || query.to) {
        filters.create_time = {
        gte: query.from ? new Date(query.from) : undefined,
        lte: query.to ? new Date(query.to) : undefined,
        };
    }

    try {
        // Fetch reviews with the filters applied
        const reviews = await prisma.product_review.findMany({
        where: filters,
        include: {
            product: true, // Include product details (game name, etc.)
        },
        });

        return reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw new Error('Failed to fetch reviews');
    }
}

async function fetchWishlistWithQuery(account_id, query) {
    let filters = {
      account_id: account_id,  // Filter by account_id (user)
    };
  
    let page = Number(query.page) || 1;  // Default page is 1
    let limit = Number(query.limit) || 10;  // Default limit is 10 items per page
    let offset = (page - 1) * limit;  // Pagination offset
  
    // Filter by product name (partial match)
    if (query.keyword) {
      filters.product = {
        name: {
          contains: query.keyword,  // Perform partial match on product name
          mode: 'insensitive',  // Case-insensitive search
        },
      };
    }
  
    // Filter by date range (from-to)
    if (query.from || query.to) {
      filters.created_at = {
        gte: query.from ? new Date(query.from) : undefined,  // From date
        lte: query.to ? new Date(query.to) : undefined,  // To date
      };
    }
  
    try {
      // Fetch wishlist items with the given filters and include related product details
      const wishlistItems = await prisma.wishlist.findMany({
        where: filters,
        include: {
          product: true,  // Include related product data (name, price, etc.)
        },
      });
  
      // Pagination logic
      let paginatedWishlist = wishlistItems.slice(offset, offset + limit);
      let totalPage = Math.ceil(wishlistItems.length / limit);
  
      return {
        wishlist: paginatedWishlist,
        totalPage: totalPage,
        currentPage: page,
      };
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return {
        error: 'Failed to fetch wishlist',
      };
    }
}

async function decodeJwt(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
}

export {
    fetchAccountByID,
    updateAccountByID,
    fetchGameCollectionWithQuery,
    fetchGameCollection,
    fetchHistoryWithQuery,
    fetchPurchaseHistory,
    fetchUserReviewWithQuery,
    fetchWishlistWithQuery,
    decodeJwt,
};