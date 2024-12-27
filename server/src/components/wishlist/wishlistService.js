import { prisma } from '../../config/config.js';
import jwt from 'jsonwebtoken';

async function decodeJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}
async function addToWishlist({ userId, productId }) {
    try {
        await prisma.wishlist.create({
            data: {
                account_id: userId,
                product_id: parseInt(productId, 10),
            },
        });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw new Error('Error adding to wishlist');
    }
}
async function removeFromWishlist({ userId, productId }) {
    try {
        await prisma.wishlist.delete({
            where: {
                account_id_product_id: {
                    account_id: userId,
                    product_id: parseInt(productId, 10),
                },
            },
        });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw new Error('Error removing from wishlist');
    }
}
async function checkProductInWishlist({ userId, productId }) {
    return await prisma.wishlist.findUnique({
        where: {
            account_id_product_id: {
                account_id: userId,
                product_id: parseInt(productId, 10),
            },
        },
    });
}
async function fetchproductIdFromWishlist({ userId }) {
    const productId = await prisma.wishlist.findMany({
        where: {
            account_id: userId,
        },
        select: {
            product_id: true,
        },
    })
    const productIds = productId.map((item) => item.product_id);
    return productIds;
}
export { decodeJwt, addToWishlist, removeFromWishlist, checkProductInWishlist, fetchproductIdFromWishlist };