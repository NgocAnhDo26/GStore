import * as profileService from './profileService.js';
import { authorize } from "../auth/verifyRoute.js";
import express from 'express';

const router = express.Router();


async function getUserInfo(req, res) {
    try {
      const token = req.cookies.authToken;
      const decoded = await profileService.decodeJwt(token);
      const id = decoded._id;
      if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  
      const userInfo = await profileService.fetchAccountByID(Number(id));
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
  const token = req.cookies.authToken;
  const decoded = await profileService.decodeJwt(token);
  const id = decoded._id;
  if (!id) {
      return res.status(400).json({ error: 'Account ID is required' });
  }

  const { name, birthdate, phone } = req.body;

  const updateData = {};
  if (name) updateData.username = name;
  if (birthdate) {
      const dateObj = new Date(birthdate);
      if (!isNaN(dateObj)) {
          updateData.birthdate = dateObj.toISOString().split('T')[0]; // Format to YYYY-MM-DD
      } else {
          return res.status(400).json({ error: 'Invalid birthdate format' });
      }
  }
  if (phone) updateData.phone = phone;

  try {
      if (Object.keys(updateData).length === 0) {
          return res.status(400).json({ error: 'No valid fields provided for update' });
      }

      const updatedUserInfo = await profileService.updateAccountByID(Number(id), updateData);

      // Check if the update was successful
      if (!updatedUserInfo) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Respond with the updated user info
      return res.status(200).json(updatedUserInfo);
  } catch (error) {
      console.error('Error updating user info:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function getUserGameCollection(req, res) {
    const token = req.cookies.authToken;
    const decoded = await profileService.decodeJwt(token);
    const id = decoded._id;
  
    if (!id) {
      return res.status(400).json({ error: 'Account ID is required' });
    }
  
    profileService
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
    const token = req.cookies.authToken;
    const decoded = await profileService.decodeJwt(token);
    const id = decoded._id;
  
    if (!id) {
      return res.status(400).json({ error: 'Account ID is required' });
    }
  
    profileService
      .fetchHistoryWithQuery(Number(id),req.query)
      .then((purchaseHistory) => {
        return res.status(200).json(purchaseHistory || []);
      })
      .catch((error) => {
        console.error('Error fetching purchase history:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      });
}

async function getUserReview(req,res) {
    const token = req.cookies.authToken;
    const decoded = await profileService.decodeJwt(token);
    const id = decoded._id;

    if (!id) {
        return res.status(400).json({ error: 'Account ID is required' });
    }

    profileService
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
    const token = req.cookies.authToken;
    const decoded = await profileService.decodeJwt(token);
    const id = decoded._id;

    if (!id) {
        return res.status(400).json({ error: 'Account ID is required' });
    }

    try {
        // Call the wishlist service to fetch the wishlist with query filters
        const result = await profileService.fetchWishlistWithQuery(Number(id), req.query);
        return res.status(200).json(result);  // Send back the result as JSON response
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
}

router.get('/info',authorize(),getUserInfo);
router.post('/info',authorize(),updateUserInfo);
router.get('/collection',authorize(),getUserGameCollection);
router.get('/history',authorize(),getPurchaseHistory);
router.get('/review',authorize(),getUserReview);
router.get('/wishlist',authorize(),getUserWishlist);

export default router;


