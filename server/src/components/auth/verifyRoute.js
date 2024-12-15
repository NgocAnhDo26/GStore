import passport from 'passport';
import { prisma } from '../../config/config.js'; 
const authorize = (isAdminRequired = false) => {
    return async (req, res, next) => {

        passport.authenticate('jwt', { session: false }, async (err, user) => {
            if (err || !user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            console.log(prisma.account);
            const tokenRecord = await prisma.Token.findUnique({
                where: {
                    token: req.header('Authorization').replace('Bearer ', '')
                }
            });
            if (!tokenRecord) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            if (isAdminRequired && !user.is_admin) {
                return res.status(403).json({ message: 'Forbidden: Admins only' });
            }
            req.user = user;
            return next();
        })(req, res, next);
    };
};

export { authorize };
