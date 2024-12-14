// passport-jwt-strategy.js

import bcrypt from 'bcryptjs';
import { prisma } from '../config/config.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();

import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'; 

let opt = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY
}

passport.use(new JWTStrategy(opt, async function(jwtPayLoad, done){
    try {
        const user = await prisma.account.findUnique({
            where: {
                id: jwtPayLoad._id
            }
        });

        if(user){
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        console.log('Error in finding user from jwt', err);
        return done(err, false);
    }
}));

export default passport;
