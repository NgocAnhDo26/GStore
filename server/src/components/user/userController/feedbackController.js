import { decodeJwt, addFeedback } from '../userService/feedbackService.js';
import express from 'express';

const userRouter = express.Router();
userRouter.post("/", async (req, res) => {
    const { content, type_id } = req.body;
    const token = req.cookies.authToken;
    if (!content) {
        return res.status(400).json({ message: 'content is required.' });
    }
    try {
        const decoded = await decodeJwt(token);
        await addFeedback({ userId: decoded._id, content, type_id });
        res.status(200).json({ message: 'Feedback added successfully' });
    } catch (err) {
        console.error('Add feedback error:', err);
        res.status(500).json({ message: 'An error occurred, please try again later.' });
    }
});
export default userRouter;