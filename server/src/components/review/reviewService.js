import { prisma } from '../../config/config.js';
import jwt from 'jsonwebtoken';

async function addReview({ userId, productId, rating, review }) {
    return await prisma.product_review.create({
        data: {
            user_id: userId,
            product_id: productId,
            rating,
            review
        }
    });
}
export { addReview };