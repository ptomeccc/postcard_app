import express from "express";
import verifyJWT from "../Middlewares/verifyJWT.js";
import { addPostcard } from "../Controllers/PostcardController.js";

const router = express.Router();

router.post("/folder/:id/add_postcard", verifyJWT, addPostcard);

export default router;
