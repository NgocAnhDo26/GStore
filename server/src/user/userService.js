import {prisma} from "../config/config.js"

async function fetchAccountInfo(accountID) {
    const accountInfo = await prisma.account.findUnique({
        where: {
            id: Number(accountID),
        },
    });
    return accountInfo;
};

async function fetchPurchaseHistory() {
    
};

async function fetchGameLibrary() {
    
};

async function fetchSecurityInfo() {

};

async function fetchAccountReview() {

};

async function fetchWishlist() {

};