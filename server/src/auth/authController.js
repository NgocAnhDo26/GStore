import bcrypt from 'bcryptjs';
import { prisma } from '../config/config.js';  
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function login(req, res) {
    const { email, password } = req.body;
    console.log(req);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await prisma.account.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const payload = {
            _id: user.id,
            email: user.email,
            isAdmin: user.is_admin,  
        };
        console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);  // Check value of JWT_SECRET_KEY

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        await prisma.Token.create({
          data: {
              token: token,
          }
      });

        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'An error occurred, please try again later.' });
    }
}

async function register(req, res) {
    const { name, email, password } = req.body;
    console.log(req);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
  }

    try {
        const user = await prisma.account.findUnique({
            where: { email }
        });

        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.account.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        res.json({ message: 'Registration successful', user: newUser });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'An error occurred, please try again later.' });
    }
}
async function logout(req, res) {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
      
      await prisma.token.delete({
          where: {
              token: token
          }
      });

      res.json({ message: 'Logout successful' });
  } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ message: 'An error occurred, please try again later.' });
  }
}
export { login, register,logout };
