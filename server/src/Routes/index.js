import { authorize } from '../components/auth/verifyRoute.js';  
import * as authController from '../components/auth/authController.js';
import profileRoute from './user.js'
import express from 'express';

const router = express.Router();


router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.post('/change-password',authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);

router.get('/admin', authorize(true), (req, res) => {
    res.status(200).json({ message: 'Welcome Admin!' });
}); 

router.use('',profileRoute);

export default router;