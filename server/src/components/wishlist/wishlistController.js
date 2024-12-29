import { addToWishlist, removeFromWishlist, decodeJwt, checkProductInWishlist, fetchproductIdFromWishlist } from './wishlistService.js';
import express from 'express';

const userRouter = express.Router();
userRouter.post("/add-to-wishlist", async (req, res) => {
    const { productId } = req.body;
    const token = req.cookies.authToken;
    if (!productId) {
        return res.status(400).json({ message: 'productId is required.' });
    }
    try {
        const decoded = await decodeJwt(token);
        const productExists = await checkProductInWishlist({ userId: decoded._id, productId });
        if (productExists) {
            return res.status(400).json({ message: 'Product already exists in wishlist.' });
        }
        await addToWishlist({ userId: decoded._id, productId });
        res.status(200).json({ message: 'Product added to wishlist successfully' });
    } catch (err) {
        console.error('Add to wishlist error:', err);
        res.status(500).json({ message: 'An error occurred, please try again later.' });
    }

});
userRouter.post("/remove-from-wishlist", async (req, res) => {
    const { productId } = req.body;
    const token = req.cookies.authToken;
    if (!productId) {
        return res.status(400).json({ message: 'productId is required.' });
    }
    try {
        const decoded = await decodeJwt(token);
        const productExists = await checkProductInWishlist({ userId: decoded._id, productId });
        if (!productExists) {
            return res.status(400).json({ message: 'Product does not exist in wishlist.' });
        }
        await removeFromWishlist({ userId: decoded._id, productId });
        res.status(200).json({ message: 'Product removed from wishlist successfully' });
    } catch (err) {
        console.error('Remove from wishlist error:', err);
        res.status(500).json({ message: 'An error occurred, please try again later.' });
    }
});
userRouter.get("/fetch-id-from-wishlist", async (req, res) => {
    const token = req.cookies.authToken;
    try {
        const decoded = await decodeJwt(token);
        const wishlist = await fetchproductIdFromWishlist({ userId: decoded._id });
        res.status(200).json({ wishlist });
    } catch (err) {
        console.error('Fetch wishlist error:', err);
        res.status(500).json({ message: 'An error occurred, please try again later.' });
    }
});



export default userRouter;
