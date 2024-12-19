import * as wishlistService from '../userService/wishlistService.js';
import express from 'express';

const router = express.Router();

async function getUserWishlist(req, res) {
    const { id } = req.user;

    if (!id) {
        return res.status(400).json({ error: 'Account ID is required' });
    }

    try {
        // Call the wishlist service to fetch the wishlist with query filters
        const result = await wishlistService.fetchWishlistWithQuery(Number(id), req.query);
        return res.status(200).json(result);  // Send back the result as JSON response
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
}

// Define the route for fetching the wishlist
router.get('/', getUserWishlist);

export default router;
