import { prisma } from '../../../config/config.js';
import express from 'express';

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

export {
  fetchUserReviewWithQuery,
};
