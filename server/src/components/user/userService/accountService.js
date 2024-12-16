import { prisma } from '../../../config/config.js';

async function fetchAccountByID(accountID) {
    const account = await prisma.account.findUnique({
        where: {accountID}
    });
    return account;
};

export {
    fetchAccountByID,
};