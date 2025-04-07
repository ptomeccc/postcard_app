import { signUp } from "../Controllers/AuthController.js";
import express from "express";

const router = express.Router();

router.post("/signup", signUp);

export default router;
