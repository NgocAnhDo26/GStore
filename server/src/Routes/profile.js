import profileController from '../components/profile/profileController.js';  
import express from 'express';

const router = express.Router();

router.use('/profile', profileController); 

export default router;
