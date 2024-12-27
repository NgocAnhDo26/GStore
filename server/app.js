import express from "express";
import path from "path";
import router from "./src/Routes/index.js";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const __dirname = import.meta.dirname;

// Init middlewares
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

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
