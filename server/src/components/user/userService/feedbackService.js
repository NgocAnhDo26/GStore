import jwt from 'jsonwebtoken';
import { prisma } from '../../../config/config.js';

async function decodeJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}
async function addFeedback({ userId, content, type_id }) {
    try {
        await prisma.feedback.create({
            data: {
                account_id: userId,
                content: content,
                type_id: parseInt(type_id,10),
            },
        });
    } catch (error) {
        console.error('Error adding feedback:', error);
        throw new Error('Error adding feedback');
    }
}
export { decodeJwt, addFeedback };