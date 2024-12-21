import * as profileService from './profileService.js';
import { authorize } from "../auth/verifyRoute.js";
import express from 'express';

const router = express.Router();

async function getUserInfo(req, res) {
    try {
      const { id } = req.user;
      if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  
      const userInfo = await accountService.fetchAccountByID(Number(id));
      if (!userInfo) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(userInfo);
    } catch (error) {
      console.error('Error fetching user info:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
}
  
async function updateUserInfo(req, res) {
    const { id } = req.user.id;
    const { name, birthdate, phone} = req.body;
  
    if (!id) {
      return res.status(400).json({ error: 'Account ID is required' });
    }
  
    accountService
      .updateAccountByID(Number(id),name,birthdate,phone)
      .then((updatedUserInfo) => {
        if (!updatedUserInfo) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(updateUserInfo);
      })
      .catch((error) => {
        console.error('Error updating user info:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      });
}

async function getUserGameCollection(req, res) {
    const { id } = req.user;
  
    if (!id) {
      return res.status(400).json({ error: 'Account ID is required' });
    }
  
    collectionService
    .fetchGameCollectionWithQuery(Number(id),req.query)
    .then((gameCollection) => {
      return res.status(200).json(gameCollection);
    })
    .catch((error) => {
      console.error('Error retrieving game collection:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
}

async function getPurchaseHistory(req, res) {
    const { id } = req.user;
  
    if (!id) {
      return res.status(400).json({ error: 'Account ID is required' });
    }
  
    historyService
      .fetchHistoryWithQuery(Number(id))
      .then((purchaseHistory) => {
        return res.status(200).json(purchaseHistory || []);
      })
      .catch((error) => {
        console.error('Error fetching purchase history:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      });
}

async function getUserReview(req,res) {
    const { id } = req.user;

    if (!id) {
        return res.status(400).json({ error: 'Account ID is required' });
    }

    reviewService
        .fetchUserReviewWithQuery(Number(id),req.query)
        .then((reviews) => {
            return res.status(200).json(reviews);
        })
        .catch((error) => {
            console.error('Error retrieving reviews:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        })
};

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

router.get('/info',authorize(),getUserInfo);
router.get('/collection',authorize(),getUserGameCollection);
router.get('/history',authorize(),getPurchaseHistory);
router.get('/review',authorize(),getUserReview);
router.get('/wishlist',authorize(),getUserWishlist);

export default router;


