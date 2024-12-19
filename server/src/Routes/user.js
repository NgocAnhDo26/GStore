import accountController from '../components/user/userController/accountController.js';  
import collectionController from '../components/user/userController/collectionController.js'; 
import reviewController from '../components/user/userController/reviewController.js';  
import historyController from '../components/user/userController/historyController.js'; 
import wishlistController from '../components/user/userController/wishlistController.js'; 
import express from 'express';

const router = express.Router();

router.use('/profile/info',accountController);
router.use('/profile/history',historyController);
router.use('/profile/collection',collectionController);
router.use('/profile/wishlist',wishlistController);
router.use('/profile/review',reviewController);

export default router;
