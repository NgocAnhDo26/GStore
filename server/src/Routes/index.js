import { authorize } from '../components/auth/verifyRoute.js';  
import * as authController from '../components/auth/authController.js';  
import * as authController from '../components/user/userController/accountController.js';  
import * as authController from '../components/user/userController/collectionController.js'; 
import * as authController from '../components/user/userController/reviewController.js';  
import * as authController from '../components/user/userController/historyController.js'; 
import * as authController from '../components/user/userController/wishlistController.js'; 
import express from 'express';

const router = express.Router();


router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);

router.get('/admin', authorize(true), (req, res) => {
    res.status(200).json({ message: 'Welcome Admin!' });
});


router.get('/profile', authorize(), (req, res) => {
    res.status(200).json({ message: 'Welcome User!', user: req.user });
});

export default router;