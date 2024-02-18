import express from "express";
const router = express.Router();

import { register, login } from "../controllers/auth.js";

// auth routes for user registering and logging in
router.post("/register", register);
router.post("/login", login);

export default router;
