import { prisma } from '../../config/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function findUserByEmail(email) {
    return await prisma.account.findUnique({ where: { email } });
}
async function findUserByUsername(username) {
    return await prisma.account.findUnique({ where: { username } });
}

async function createUser({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.account.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    });
}

async function comparePasswords(inputPassword, userPassword) {
    return await bcrypt.compare(inputPassword, userPassword);
}

function generateToken(user) {
    const payload = {
        _id: user.id,
        email: user.email,
        isAdmin: user.is_admin,
    };
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
}

async function changeUserPassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await prisma.account.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });
}
async function decodeJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}

export {
    findUserByEmail,
    findUserByUsername,
    createUser,
    comparePasswords,
    generateToken,
    changeUserPassword,
    decodeJwt
};
