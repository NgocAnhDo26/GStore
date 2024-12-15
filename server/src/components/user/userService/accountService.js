import { prisma } from '../../../config/config.js';

async function fetchInfoByID(accountID) {
    const account = await prisma.account.findUnique({
        where: {
            id: Number(accountID),
        }  
    });
    return account;
}