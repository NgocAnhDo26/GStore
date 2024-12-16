import { authorize } from '../components/auth/verifyRoute.js';  
import * as authController from '../components/auth/authController.js';  
import * as accountController from '../components/user/userController/accountController.js';  
import * as collectionController from '../components/user/userController/collectionController.js'; 
import * as reviewController from '../components/user/userController/reviewController.js';  
import * as historyController from '../components/user/userController/historyController.js'; 
import * as wishlistController from '../components/user/userController/wishlistController.js'; 
import express from 'express';

const router = express.Router();


router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);

router.get('/admin', authorize(true), (req, res) => {
    res.status(200).json({ message: 'Welcome Admin!' });
});


router.get('/profile/:id/info', authorize(), accountController.getUserInfo); 
router.get('/profile/:id/collection', authorize(), collectionController.getUserGameCollection); 
router.get('/profile/:id/history', authorize(), historyController.getPurchaseHistory); 

export default router;