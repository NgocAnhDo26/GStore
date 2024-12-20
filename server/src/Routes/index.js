import express from "express";
import users from "./users.js";
import api from "./api.js";

const router = express.Router();

router.use("/", users);
router.use("/api", api);

export default router;
