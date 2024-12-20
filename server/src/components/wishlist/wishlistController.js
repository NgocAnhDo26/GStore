import { } from './reviewService.js';
import jwt from 'jsonwebtoken';
import express from 'express';
import { sendResetEmail } from './sendEmail.js';


const userRouter = express.Router();
userRouter.post("/add-to-wishlist", async (req, res) => {
});
userRouter.post("/remove-from-wishlist", async (req, res) => {
});

export default userRouter;
