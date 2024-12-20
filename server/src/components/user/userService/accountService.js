import { prisma } from '../../../config/config.js';

async function fetchAccountByID(accountID) {
    console.log('Fetching account with ID:', accountID);

    const account = await prisma.account.findUnique({
        where: { id: accountID },
        select: {
            id: true,
            username: true,
            email: true,
            address: true,
            birthdate: true,
            create_time: true,
        }
    });

    console.log('Account found:', account);
    return account;
};

async function updateAccountByID(accountID,name,birthdate,phone) {
    console.log('Updating account with ID:', accountID);
    const updatedUser = await prisma.account.update({
        where: {
            id: accountID
        },
        data: {
            username: name,
            birthdate: birthdate,
            phone: phone,
        }
    });
    console.log('Account found:', updatedUser);
    return updatedUser;
}

export {
    fetchAccountByID,
    updateAccountByID,
};