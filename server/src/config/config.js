import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import "./passport-jwt-strategy.js"; // Import the passport configuration
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

dotenv.config();
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for file handling
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

export { prisma, upload, cloudinary };
