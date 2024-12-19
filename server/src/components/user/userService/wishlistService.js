import { prisma } from '../../../config/config.js';

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

export {
    fetchWishlistWithQuery,
};