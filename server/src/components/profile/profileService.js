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
            product: true, // Include product data
          },
        },
      },
      skip: offset,
      take: limit,
    });

    // Flatten and filter duplicates
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

    // Remove duplicates based on product ID
    const uniqueGames = Array.from(
      new Map(filteredGames.map(game => [game.id, game])).values()
    );

    const totalCount = await prisma.orders.count({
      where: orderFilter,
    });

    // Calculate total pages
    const totalPage = Math.ceil(totalCount / limit);

    return {
      games: uniqueGames,
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

  if (query.id) {
    filters.id = Number(query.id);
  }
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
    account_id: account_id, // Filter by account_id (user)
  };

  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  let offset = (page - 1) * limit;

  // Add filters for product name (partial match)
  if (query.name) {
    filters.product = {
      name: { contains: query.name },
    };
  }

  try {
    // Fetch wishlist items with filters
    const wishlistItems = await prisma.wishlist.findMany({
      where: filters,
      include: {
        product: true, // Include product data (id, name, price, price_sale)
      },
    });

    if (wishlistItems.length === 0) {
      return {
        wishlist: [],
        totalPage: 0,
        currentPage: page,
      };
    }

    // Apply price filtering (considering price_sale if available)
    const filteredWishlist = wishlistItems.filter((item) => {
      const price = item.product.price_sale ?? item.product.price; // Use price_sale if it exists, otherwise price
      if (query.min && price < Number(query.min)) return false;
      if (query.max && price > Number(query.max)) return false;
      return true;
    });

    // Fetch profile images for all products in the filtered wishlist
    const productIds = filteredWishlist.map((item) => item.product.id);
    const profileImages = await prisma.product_image.findMany({
      where: {
        product_id: { in: productIds },
        is_profile_img: true,
      },
      select: {
        product_id: true,
        public_id: true,
      },
    });

    // Map profile images to their respective products
    const imageMap = profileImages.reduce((map, image) => {
      map[image.product_id] = image.public_id;
      return map;
    }, {});

    // Map filtered wishlist items to include profile image and price logic
    const paginatedWishlist = filteredWishlist.slice(offset, offset + limit).map((item) => ({
      wishlist_id: item.id,
      account_id: item.account_id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_price: item.product.price,
      product_price_sale: item.product.price_sale || null,
      product_profile_image: imageMap[item.product.id] || null, // Add profile image or null
      create_time: item.created_time,
    }));

    const totalPage = Math.ceil(filteredWishlist.length / limit);

    return {
      wishlist: paginatedWishlist,
      totalPage: totalPage,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return {
      error: "Failed to fetch wishlist",
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