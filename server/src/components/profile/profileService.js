import { prisma } from '../../config/config.js';
import jwt from 'jsonwebtoken';

async function fetchAccountByID(accountID) {
    console.log('Fetching account with ID:', accountID);

    const account = await prisma.account.findUnique({
        where: { id: accountID },
        select: {
            id: true,
            username: true,
            phone:true,
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
    const orderFilter = {
      account_id,
      status: "Completed", 
    };

    // Pagination setup
    const page = Number(query.page) || 1; 
    const limit = Number(query.limit) || 10; 
    const offset = (page - 1) * limit; 

    // Keyword filter (optional)
    const keywordFilters = [];
    if (query.keyword) {
      keywordFilters.push({
        product: {
          name: { contains: query.keyword },
        },
      });
    }

    // Date range filter for order creation (optional)
    if (query.from && query.to) {
      orderFilter.create_time = {
        gte: new Date(query.from), 
        lte: new Date(query.to),   
      };
    }

    // Query orders and related order_products with pagination
    const gameCollection = await prisma.orders.findMany({
      where: orderFilter,
      include: {
        order_product: {
          where: keywordFilters.length > 0 ? { OR: keywordFilters } : undefined,
          include: {
            product: true,  // Include product data
          },
        },
      },
      skip: offset, 
      take: limit,  
    });
    const filteredGames = gameCollection.flatMap(order =>
      order.order_product
        .filter(orderProduct => {
          const productCreateTime = new Date(orderProduct.product.create_time);
          
          // Apply date filtering if either from or to is provided
          if (query.from && query.to) {
            return productCreateTime >= new Date(query.from) && productCreateTime <= new Date(query.to);
          } else if (query.from) {
            return productCreateTime >= new Date(query.from); // Filter if only from is provided
          } else if (query.to) {
            return productCreateTime <= new Date(query.to); // Filter if only to is provided
          }
          
          return true; 
        })
        .map(orderProduct => orderProduct.product)
    );
    

    const totalCount = await prisma.orders.count({
      where: orderFilter,
    });

    // Calculate total pages
    const totalPage = Math.ceil(totalCount / limit);

    return {
      games: filteredGames,
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
  let filters = { account_id: account_id };
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  let offset = (page - 1) * limit;

  // Filter by time range
  if (query.from || query.to) {
    filters.create_time = {
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
          product: true,
        },
        where: query.id
          ? {
              product: {
                id: Number(query.id),
              },
            }
          : undefined, // Only apply filter if query.id exists
      },
    },
  });

  if (!history.some((order) => order.order_product.length > 0)) {
    return {
      history: [],
      totalPage: 0,
      currentPage: page,
    };
  }

  // Calculate total price dynamically and apply min and max filters
  const filteredHistory = history
    .map((order) => {
      const total_price = order.order_product.reduce((sum, op) => {
        return sum + op.product.price * op.quantity;
      }, 0);

      return {
        order_id: order.id,
        total_price: total_price,
        created_at: order.create_time,
        status: order.status,
        products: order.order_product.map((op) => ({
          product_id: op.product_id,
          product_name: op.product.name,
          product_price: op.product.price,
          quantity: op.quantity,
        })),
      };
    })
    .filter((order) => {
      // Apply min and max filters
      console.log(query.min)
      if (query.min && order.total_price < Number(query.min)) {
        return false;
      }
      if (query.max && order.total_price > Number(query.max)) {
        return false;
      }
      return true;
    });

  // Pagination logic
  const paginatedHistory = filteredHistory.slice(offset, offset + limit);
  const totalPage = Math.ceil(filteredHistory.length / limit);

  return {
    history: paginatedHistory,
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
      contains: query.content, 
    };
  }

  // Filter by rating
  if (query.rating) {
    filters.rating = {
      gte: Number(query.rating), 
    };
  }

  // Filter by date range (from, to)
  if (query.from || query.to) {
    filters.create_time = {
      gte: query.from ? new Date(query.from) : undefined,
      lte: query.to ? new Date(query.to) : undefined,
    };
  }

  // Pagination logic
  let page = Number(query.page) || 1;  
  let limit = Number(query.limit) || 10;  
  let offset = (page - 1) * limit;  

  try {
    
    const reviews = await prisma.product_review.findMany({
      where: filters,
      include: {
        product: true, 
      },
    });

    // Filter reviews by game name (if provided) after fetching the data
    const filteredReviews = query.name
      ? reviews.filter((review) =>
          review.product.name.toLowerCase().includes(query.name.toLowerCase())
        )
      : reviews;

    // Pagination and empty history handling
    const paginatedReviews = filteredReviews.slice(offset, offset + limit);
    const totalPage = Math.ceil(filteredReviews.length / limit);

    if (filteredReviews.length === 0) {
      return {
        review: [],
        totalPage: 0,
        currentPage: page,
      };
    }

    return {
      review: paginatedReviews,
      totalPage: totalPage,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
}



async function fetchWishlistWithQuery(account_id, query) {
  let filters = {
    account_id: account_id,  // Filter by account_id (user)
  };

  let page = Number(query.page) || 1;  
  let limit = Number(query.limit) || 10;  
  let offset = (page - 1) * limit;  

  // Filter by product name (partial match in the product table)
  let productFilters = {};
  if (query.name) {
    productFilters.name = {
      contains: query.name,  
    };
  }

  // Filter by date range (from-to)
  if (query.from || query.to) {
    filters.created_time = {
      gte: query.from ? new Date(query.from) : undefined,  
      lte: query.to ? new Date(query.to) : undefined,  
    };
  }

  try {
    // Fetch wishlist items with the given filters and include related product details
    const wishlistItems = await prisma.wishlist.findMany({
      where: {
        ...filters,
        product: productFilters,  
      },
      include: {
        product: true,  
      },
    });

    if (wishlistItems.length === 0) {
      return {
        wishlist: [],
        totalPage: 0,
        currentPage: page,
      };
    }

    let paginatedWishlist = wishlistItems.slice(offset, offset + limit);
    let totalPage = Math.ceil(wishlistItems.length / limit);

    // Return the wishlist with create_time included in the response
    return {
      wishlist: paginatedWishlist.map(item => ({
        ...item,
        create_time: item.created_time,  // Include create_time in the response
      })),
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