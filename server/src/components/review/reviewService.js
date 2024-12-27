import { prisma } from '../../config/config.js';
import jwt from 'jsonwebtoken';


async function findReviewByKey(productId, userId) {
    console.log("result", productId, userId);
    return await prisma.product_review.findUnique({

        where: {
            product_id_account_id: {
                product_id: parseInt(productId, 10),
                account_id: userId,
            },
        },
    });
}
async function addReview({ userId, productId, rating, content }) {
    try {
        const review = await prisma.product_review.create({
            data: {
                product_id: parseInt(productId, 10),
                account_id: userId,
                rating: parseInt(rating, 10),
                content: content,
            },
            select: {
                product_id: true,
                account_id: true,
                rating: true,
                content: true,
                create_time: true,
            },
        });

        return review;
    } catch (error) {
        console.error("Error adding review:", error);
        throw new Error('Error adding review');
    }
}

async function decodeJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}




export { addReview, decodeJwt, findReviewByKey };