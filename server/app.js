import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./src/Routes/index.js";

import passportJWT from './src/config/passport-jwt-strategy.js';
import { PrismaClient } from "@prisma/client";


const app = express();
const __dirname = import.meta.dirname;

// Init middlewares
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS
app.use(cookieParser()); // Enable cookie parser

// Init routes
app.use("", router);

// Init database
export const prisma = new PrismaClient();

// Use static files
// app.use(express.static(path.join(__dirname, "public")));

// Server setup
const PORT = process.env.PORT ?? 1111;

const server = app.listen(PORT, () => {
    console.log(`GStore starts at port http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
    server.close(() => {
        console.log("Exit Server Express");
        prisma.$disconnect;
    });
});

// Handing errors

export default app;
