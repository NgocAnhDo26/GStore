import express from 'express';
import { replyFeedback,fetchFeedback } from './feedbackService.js';


const adminRouter = express.Router();
adminRouter.post("/", async (req, res) => {
    const { email, content } = req.body;

    if (!email || !content) {
        return res.status(400).json({ content: 'Email and content are required.' });
    }

    try {
        await replyFeedback(email, content);

        res.status(200).json({ message: 'Feedback sent successfully' });
    } catch (err) {
        console.error('Feedback error:', err);
        res.status(500).json({ message: 'An error occurred, please try again later.' });
    }
});
adminRouter.get("/", async (req, res) => {
    try {
        const feedback = await fetchFeedback();
        res.status(200).json({ feedback });
    } catch (err) {
        console.error('Fetch feedback error:', err);
        res.status(500).json({ message: 'An error occurred, please try again later.' });
    }
});

export default adminRouter;
