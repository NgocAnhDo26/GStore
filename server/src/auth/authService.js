import bcrypt from "bcryptjs";
import { prisma } from "../config/config.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendResetEmail } from "./sendEmail.js";

async function register(userinfo) {
  const { name, email, password } = userinfo;

  if (!email || !password || !name) {
    return { message: "Fields must not be empty", status: 400 };
  }

  const user = await prisma.account.findUnique({
    where: { email },
  });

  if (user) {
    return { message: "Email already exists", status: 400 };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.account.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  const payload = {
    id: newUser.id,
    email: newUser.email,
    isAdmin: newUser.is_admin,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  await prisma.Token.create({
    data: {
      token: token,
    },
  });

  return {
    message: "Registration successful",
    token: token,
    user: newUser,
    status: 200,
  };
}

async function login(userinfo) {
  const { email, password } = userinfo;

  if (!email || !password) {
    return { message: "Fields must not be empty", status: 400 };
  }

  const user = await prisma.account.findUnique({
    where: { email },
  });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const payload = {
        id: user.id,
        email: user.email,
        isAdmin: user.is_admin,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });

      await prisma.Token.create({
        data: {
          token: token,
        },
      });

      return {
        message: "Login successful",
        token: token,
        user: user,
        status: 200,
      };
    }
  }
  return { message: "Incorrect email or password", status: 401 };
}

export { login, register };
