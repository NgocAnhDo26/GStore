import { prisma } from '../../../config/config.js';

async function fetchUserReview(accountID) {
    reviews = await prisma.product_review({
        where: {
            account_id: accountID,
        }
    });
    return reviews;
}

export { fetchUserReview };