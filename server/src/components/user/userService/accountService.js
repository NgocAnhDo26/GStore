import { prisma } from '../../../config/config.js';

async function fetchAccountByID(accountID) {
    console.log('Fetching account with ID:', accountID);

    const account = await prisma.account.findUnique({
        where: { id: accountID }
    });

    console.log('Account found:', account);
    return account;
};

export {
    fetchAccountByID,
};