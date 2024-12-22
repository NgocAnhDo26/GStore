import "./src/config/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import router from "./src/Routes/index.js";

const app = express();

// Init middlewares
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS
app.use(cookieParser()); // Enable cookie parser
app.use(passport.initialize());

// Init routes
app.use("/", router);

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
