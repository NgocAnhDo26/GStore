import { addReview, decodeJwt, findReviewByKey } from './reviewService.js';

import express from 'express';
//import { sendResetEmail } from './sendEmail.js';


const userRouter = express.Router();

userRouter.post("/", async (req, res) => {


    const { productId, rating, content } = req.body;
    if (!productId || !rating || !content) {
        return res.status(400).json({ message: 'Product ID, rating and content are required.' });
    }

    const token = req.cookies.authToken;
    try {
        const decoded = await decodeJwt(token);
        const reviewExists = await findReviewByKey(productId, decoded._id);
        console.log("reviewExists", reviewExists);

        if (reviewExists) {
            return res.status(400).json({ message: 'You may only add review once per game.' });
        }

        const review = await addReview({ userId: decoded._id, productId, rating, content });
        res.status(200).json({ message: 'Review added successfully', review});
    } catch (err) {
        console.error('Add review error:', err);
        res.status(500).json({ message: 'An error occurred, please try again later.' });
    }
});





export default userRouter;
