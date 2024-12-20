import {addReview } from './reviewService.js';
import jwt from 'jsonwebtoken';
import express from 'express';
import { sendResetEmail } from './sendEmail.js';


const userRouter = express.Router();

userRouter.post("/add-reivew", async (req, res) => {

});
userRouter.post("/feedback", async (req, res) => {

});

export default userRouter;
